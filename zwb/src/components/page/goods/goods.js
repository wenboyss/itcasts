export default {
  data () {
    return {
      // 搜索框中的数据
      search: '',
      // 商品列表数据
      goodsList: [],
      // 当前页
      pagenum: 1,
      // 页容量
      pagesize: 10,
      // 总条数
      total: 0
    }
  },
  methods: {
    // 得到所有的商品数据
    async getGoodsList () {
      var res = await this.$http.get(`/goods?query=${this.search}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      var {meta, data} = res.data
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 打开商品添加页面
    add () {
      this.$router.push('/goods/add')
    }
  },
  mounted () {
    this.getGoodsList()
  }
}
