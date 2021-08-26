import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      reducer: (state) => ({ cart: { items: state.cart.items } })
    }).plugin(store);
  });
};
