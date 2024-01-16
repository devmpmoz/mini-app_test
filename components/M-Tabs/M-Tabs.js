Component({
  mixins: [],
  data: {},
  props: {
    tabs: [],
    showPlus: false,
    swipeable: false,
    animation: true,
    activeTab: 0,
    duration: 500,
    tabBarInactiveTextColor: "",
    tabBarActiveTextColor: "",
    tabBarUnderlineColor: "",
    className: "",
    activeCls: "",
    tabBarCls: "",
    onTabChange() {},
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    /**
     * calcScrollLeft: Calculates the amount of scroll required
     * @param {string} windowWidth
     * @param {string} tabWidth
     * @param {string} current
     * @Note Function copied from mini-antui lib
     */
    calcScrollLeft(windowWidth, tabWidth, current) {
      let scrollInit = current * windowWidth * tabWidth;

      if (current <= 2) {
        scrollInit = 0;
      } else {
        scrollInit = (current - 2) * windowWidth * tabWidth;
      }

      return scrollInit;
    },
    /**
     * handleTabClick: On tab click set the active tab
     * @param {{index: string}} event
     */
    handleTabClick(e) {
      const index = e.target.dataset.index;
      this.props.onTabChange && this.props.onTabChange(index);
      this.setData({ activeTab: index });
    },
    /**
     * handleTabChange: On tab swipe, if "isSwipeable" is true, set the active tab
     * @param {{index: string}} event
     */
    handleTabChange(e) {
      const index = e.target.dataset.index;
      this.props.onTabChange && this.props.onTabChange(index);
      this.setData({ activeTab: e.target.dataset.index });
    },
  },
});
