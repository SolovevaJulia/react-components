import { makeAutoObservable } from 'mobx';
import { v4 as uuid } from 'uuid';
// В реальном проекте тут должны быть API-запросы
// import { getCalculatedPrice, createPlanOrder, createOrder } from 'api';

class OrderStore {
  name = null;
  plans = [];
  price = {};
  tariff = 2;
  style = 'scandy';
  promocode = null;
  error = null;
  paymentLink = null;

  constructor() {
    makeAutoObservable(this);
  }

  get sum() {
    return String(this.price.sum ?? 0).replace('.', ',');
  }

  get itemPrice() {
    return this.price.items ? String(Object.keys(this.price.items)).replace('.', ',') : '';
  }

  get count() {
    return this.price.items ? String(Object.values(this.price.items)) : '';
  }

  setStyle(style) {
    this.style = style;
  }

  setTariff(tariff) {
    this.tariff = tariff;
    this.calculate();
  }

  setPromo(promo) {
    this.promocode = promo;
  }

  init(plans, name) {
    this.name = name;
    this.style = 'scandy';
    this.tariff = 2;
    this.plans = this.getModifiedFiles(plans);
    this.calculate();
  }

  deleteFile(id) {
    this.plans = this.plans.filter((item) => item.id !== id);
    if (this.plans.length === 0) this.name = null;
    this.calculate();
  }

  addFiles(files) {
    this.plans = this.plans.concat(this.getModifiedFiles(files));
    this.calculate();
  }

  getModifiedFiles(files) {
    return Array.from(files).map((file) => ({
      id: uuid(),
      file
    }));
  }

  async calculate() {
    const params = {
      count: this.plans.length,
      promocode: this.promocode || null,
      tariff_id: this.tariff
    };
    try {
      const data = await mockGetCalculatedPrice(params);
      this.price = data;
    } catch (error) {
      this.error = 'Ошибка при расчёте цены';
    }
  }

  close() {
    this.plans = [];
  }

  async createOrder(email, customerType) {
    this.error = null;
    const fd = new FormData();

    fd.append('style', this.style);
    fd.append('tariff_id', this.tariff);
    fd.append('email', email);
    fd.append('customer_type', customerType);

    this.plans.forEach((plan) => fd.append('plans[]', plan.file));

    if (this.promocode) {
      fd.append('promocode', this.promocode);
    }

    try {
      // В реальном проекте заменено на API-запрос
      const data = await mockCreateOrder(fd);
      this.paymentLink = data.payment_link;
    } catch (e) {
      this.error = 'Ошибка при создании заказа';
    }
  }

  async createPlanOrder(formData) {
    this.error = null;

    try {
      // В реальном проекте заменено на API-запрос
      const data = await mockCreatePlanOrder(formData);
      this.paymentLink = data.payment_link;
      return data;
    } catch (e) {
      this.error = 'Ошибка при создании заказа';
      throw e;
    }
  }
}

/** Мок-функция для расчёта цены */
async function mockGetCalculatedPrice(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ items: { "10.00": params.count }, count: params.count, sum: params.count * 10 });
    }, 500);
  });
}

/** Мок-функция для создания заказа */
async function mockCreateOrder(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ payment_link: "https://mock-payment.com" });
    }, 500);
  });
}

/** Мок-функция для создания заказа планов */
async function mockCreatePlanOrder(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ payment_link: "https://mock-plan-order.com" });
    }, 500);
  });
}

export default new OrderStore();
