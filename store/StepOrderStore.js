import { makeAutoObservable } from 'mobx';
import { Mathf } from 'lib/Mathf';
// В реальном проекте импорт API:
// import { createPlanOrder, getCalculatedPrice } from 'api';

/** Дефолтные значения хранилища */
const defaults = {
  style: 'scandy',
  environmentType: 'city',
  windowType: 'standard',
  propertyType: 'apartment',
  plansCount: 1,
  plans: [],
  logo: undefined,
  link: undefined,
  comment: undefined,
  customerType: 'company',
  promocode: undefined,
  currentStep: 0,
  calculatedPrice: { items: {}, count: 0, sum: 0 },
  paymentLink: undefined,
  errors: { errorMessagePromo: undefined, errorMessage: undefined }
};

class StepOrderStore {
  isVisible = false;
  tariff = 2;
  style = defaults.style;
  environmentType = defaults.environmentType;
  windowType = defaults.windowType;
  propertyType = defaults.propertyType;
  plansCount = defaults.plansCount;
  plans = [];
  logo = undefined;
  link = undefined;
  comment = undefined;
  customerType = defaults.customerType;
  promocode = undefined;
  currentStep = 0;
  stepsCount = 5;
  calculatedPrice = defaults.calculatedPrice;
  paymentLink = undefined;
  errors = defaults.errors;

  constructor() {
    makeAutoObservable(this);
  }

  get stepsFlags() {
    return Array.from({ length: this.stepsCount }, (_, i) => this.currentStep <= i);
  }

  addFloor() {
    this.setPlansCount(this.plansCount + 1);
  }

  removeFloor() {
    this.setPlansCount(this.plansCount - 1);
  }

  openNextStep() {
    if (this.currentStep < this.stepsCount - 1) {
      this.setCurrentStep(this.currentStep + 1);
    }
  }

  openPrevStep() {
    if (this.currentStep > 0) {
      this.setCurrentStep(this.currentStep - 1);
    }
  }

  reset() {
    Object.assign(this, defaults);
  }

  fromItem(item) {
    [
      { from: 'customer_type', to: 'customerType' },
      { from: 'environment_type', to: 'environmentType' },
      { from: 'property_type', to: 'propertyType' },
      { from: 'promocode', to: 'promocode' },
      { from: 'style', to: 'style' },
      { from: 'tariff_id', to: 'tariff' },
      { from: 'total_plans_count', to: 'plansCount' },
      { from: 'widget_branding_logo_path', to: 'logo' },
      { from: 'payment_link', to: 'paymentLink' }
    ].forEach(({ from, to }) => {
      if (item[from] != null) {
        this[to] = item[from];
      }
    });
  }

  async calculatePrice() {
    const params = {
      count: this.plansCount,
      tariff_id: this.tariff,
      promocode: this.promocode || undefined
    };

    try {
      // В реальном проекте заменено на API-запрос
      const data = await mockGetCalculatedPrice(params);
      this.setCalculatedPrice({ ...data, count: this.plansCount });
    } catch (e) {
      console.error('Ошибка при расчёте цены:', e);
    }
  }

  async makeOrder(email) {
    this.setErrors({ errorMessagePromo: undefined, errorMessage: undefined });

    if (!email) return;

    const fd = new FormData();
    fd.append('email', email);
    fd.append('customer_type', this.customerType);
    fd.append('style', this.style);
    fd.append('window_type', this.windowType);
    fd.append('tariff_id', this.tariff);
    fd.append('comment', this.comment || undefined);
    fd.append('property_type', this.propertyType);
    fd.append('plans_count', this.plansCount);
    this.plans.forEach((plan) => fd.append('plans[]', plan));

    if (this.promocode) {
      fd.append('promocode', this.promocode);
    }

    if (this.tariff !== 1) {
      fd.append('environment_type', this.environmentType);
    }

    if (this.tariff === 3 || this.tariff === 6) {
      fd.append('widget_branding_logo', this.logo);
      fd.append('widget_branding_url', this.link);
    }

    try {
      // В реальном проекте заменено на API-запрос
      const data = await mockCreatePlanOrder(fd);
      this.setPaymentLink(data.payment_link);
    } catch (err) {
      this.setErrors({ errorMessage: 'Ошибка при создании заказа' });
    }
  }

  setVisible(value) {
    this.isVisible = value;
  }

  async setTariff(value) {
    this.tariff = value;
    await this.calculatePrice();
  }

  setStyle(value) {
    this.style = value;
  }

  setEnvironmentType(value) {
    this.environmentType = value;
  }

  setWindowType(value) {
    this.windowType = value;
  }

  setPropertyType(value) {
    this.propertyType = value;
  }

  async setPlansCount(value) {
    this.plansCount = Mathf.clamp(value, 1, 300);
    await this.calculatePrice();
  }

  setPlans(value) {
    this.plans = value;
  }

  setLogo(value) {
    this.logo = value;
  }

  setLink(value) {
    this.link = value;
  }

  setComment(value) {
    this.comment = value;
  }

  setCustomerType(value) {
    this.customerType = value;
  }

  async setPromocode(value) {
    this.promocode = value;
    await this.calculatePrice();
  }

  setCurrentStep(value) {
    this.currentStep = Mathf.clamp(value, 0, this.stepsCount - 1);
  }

  setCalculatedPrice(value) {
    this.calculatedPrice = value;
  }

  setPaymentLink(value) {
    this.paymentLink = value;
  }

  setErrors(value) {
    this.errors = value;
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
async function mockCreatePlanOrder(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ payment_link: "https://mock-payment-link.com" });
    }, 500);
  });
}

export default new StepOrderStore();
