<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="( crtCount=='customerCount'? 'active' : '' )+' card-panel'"
        @click="handleSetLineChartData('customerCount')"
      >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">客户总数</div>
          <count-to
            :start-val="0"
            :end-val="customerCount"
            :duration="2600"
            autoplay
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="( crtCount=='sellingPriceCount'? 'active' : '' )+' card-panel'"
        @click="handleSetLineChartData('sellingPriceCount')"
      >
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">销售总额</div>
          <count-to
            :start-val="0"
            :end-val="sellingPriceCount"
            :duration="3000"
            autoplay
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="( crtCount=='profitPriceCount'? 'active' : '' )+' card-panel'"
        @click="handleSetLineChartData('profitPriceCount')"
      >
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">盈利总额</div>
          <count-to
            :start-val="0"
            :end-val="profitPriceCount"
            :duration="3200"
            autoplay
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div
        :class="( crtCount=='orderCount'? 'active' : '' )+' card-panel'"
        @click="handleSetLineChartData('orderCount')"
      >
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">订单总数</div>
          <count-to
            :start-val="0"
            :end-val="orderCount"
            :duration="3600"
            autoplay
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { totalCount } from '@/api/dashboard'
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      crtCount: 'profitPriceCount',
      customerCount: 0,
      sellingPriceCount: 0,
      profitPriceCount: 0,
      orderCount: 0
    }
  },
  created() {
    this.getCount()
  },
  methods: {
    handleSetLineChartData(type) {
      this.crtCount = type
      this.$emit('handleSetLineChartData', type)
    },
    getCount() {
      totalCount().then(response => {
        if (response.Code == 0) {
          this.customerCount = response.Data.customerCount
          this.sellingPriceCount = response.Data.sellingPriceCount
          this.profitPriceCount = response.Data.profitPriceCount
          this.orderCount = response.Data.orderCount
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    //&:  上一级  .card-panel.hover
    &:hover,
    &.active {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
