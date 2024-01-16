Component({
  mixins: [],
  data: {},
  props: {
    isLoading: false,
    sections: [
      {
        title: "",
        data: [
          {
            leftTitle: "",
            leftDescription: "",
            rightTitle: "",
            rightDescription: "",
            onRowClick: () => {},
            rowData: null,
          },
        ],
        showSectionButton: false,
        sectionButtonLabel: "",
        sectionButtonAction: () => {},
      },
    ],
    emptyTitle: "",
    emptyIcon: "",
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onRowClick(e) {
      const index = e.target.dataset.value;
      const section_index = index.split("_")[0];
      const row_index = index.split("_")[1];
      const currentRow =
        this.props.sections[section_index] &&
        this.props.sections[section_index].data[row_index];
      if (currentRow && currentRow.onRowClick) {
        currentRow.onRowClick(currentRow.rowData);
      }
    },
    onSectionButtonClick(e) {
      const index = e.target.dataset.value;
      if (
        this.props.sections[index] &&
        this.props.sections[index].sectionButtonAction
      ) {
        this.props.sections[index].sectionButtonAction();
      }
    },
  },
});
