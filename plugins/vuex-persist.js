import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
      /* options */
    }).plugin(store);
  });
};
