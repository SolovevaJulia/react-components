import { makeAutoObservable } from 'mobx';
import { v4 as uuid } from 'uuid';
import { getCalculatedPrice, createPlanOrder, createOrder } from 'api';
import UserStore from './UserStore';

class OrderStore {
  name = null;
  plans = [];
  price = {};
  tariff = 2;
  style = 'scandy';
  promocode = null;
  error = null;

  constructor() {
    makeAutoObservable(this);
  }

  get sum() {
    return String(this.price.sum).replace('.', ',');
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
    this.plans = this.getModifityFiles(plans);
    this.calculate();
  }

  deleteFile(id) {
    this.plans = this.plans.filter((item) => item.id !== id);
    if (this.plans.length === 0) this.name = null;
    this.calculate();
  }

  addFiles(files) {
    this.plans = this.plans.concat(this.getModifityFiles(files));
    this.calculate();
  }

  getModifityFiles(files) {
    return Array.from(files).map((file) => {
      return {
        id: uuid(),
        file
      };
    });
  }

  calculate() {
    const params = {
      count: this.plans.length,
      promocode: this.promocode === '' ? null : this.promocode,
      tariff_id: this.tariff
    };
    getCalculatedPrice(params).then(({ data }) => {
      this.price = data;
    });
  }

  close() {
    this.plans = [];
  }

  createOrder() {
    this.error = null;
    const fd = new FormData();

    fd.append('style', this.style);
    fd.append('tariff_id', this.tariff);
    fd.append('email', UserStore.email);
    fd.append('customer_type', UserStore.customerType);

    this.plans.forEach((plan) => fd.append('plans[]', plan.file));

    if (this.promocode) {
      fd.append('promocode', this.promocode);
    }

    return createOrder(token, fd)
      .then(({ data }) => {
        this.paymentLink = data.data.payment_link;
      })
      .catch((e) => (this.error = e.response.data.message));
  }

  createPlanOrder(formData) {
    this.error = null;

    return createPlanOrder(token, formData)
      .then(({ data }) => {
        this.paymentLink = data.data.payment_link;
        return data;
      })
      .catch((e) => {
        this.error = e.response.data.message;
        throw e;
      });
  }
}

export default new OrderStore();
