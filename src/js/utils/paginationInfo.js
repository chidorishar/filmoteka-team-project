const pagination = {
  currentPage: 1,
  totalPages: 1,

  currentPageIncreaseByOne() {
    if (this.currentPage === this.totalPages) {
      return;
    }

    this.currentPage += 1;
  },

  currentPageReduceByOne() {
    if (this.currentPage === 1) {
      return;
    }

    this.currentPage -= 1;
  },

  updateCurrentPage(newCurrentPage) {
    this.currentPage = newCurrentPage;
  },
};

export { pagination };
