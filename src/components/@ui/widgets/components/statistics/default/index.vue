<template>
  <div :class="[$style.online, $style.widget]">
    <div :class="$style.wrap">
      <div :class="$style.content">
        <WidgetOnline :color="color" :convertedTimer="convertedTimer" :allMatchData="allMatchData" :widgetData="widgetData" :class="$style.online"/>
        <div :class="$style.list">
          <div :class="$style.events">
            <!--<p>s</p>-->
            <div v-for="(item, index) in statistics.Side_1" :key="index" :class="$style.event">
              <div v-if="item.hasOwnProperty('count')" :class="$style.count">
                <p>{{ item.count }}</p>
              </div>
              <div v-if="item.hasOwnProperty('name')" :class="$style.name">
                <p>{{ item.name }}</p>
              </div>
              <div v-if="statistics.Side_2 && item.hasOwnProperty('count')" :class="$style.count">
                <p>{{ statistics.Side_2[index].count }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {} from '@vue/composition-api'
import WidgetOnline from '../../online/statistics'

export default {
  name: 'widget-statictics',
  components: {
    WidgetOnline,
  },
  props: {
    widgetData: {
      type: Object,
      default: () => {},
    },
    allMatchData: {
      type: Object,
      default: () => {},
    },
    convertedTimer: {
      type: String,
      default: '',
    },
    statistics: {
      type: Object,
      default: () => {},
    },
    color: {
      type: String,
      default: '',
    },
  },

  setup() {

  },
}
</script>
<style lang="scss" scope module>
  .widget {
    width: 100%;
    display: flex;
    .wrap {
      display: flex;
      width: 100%;
      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        //justify-content: flex-start;
        //background: linear-gradient(180deg, rgba(34, 34, 34, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%);
        .online {
          height: 3.9rem;
          margin-bottom: 5rem;
        }
        .list {
          display: flex;
          //justify-content: center;
          .events {
            display: flex;
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
            // margin: 0 auto 0rem auto;
            max-height: calc(49.4rem - (3.9rem + 5rem));
            .event {
              display: flex;
              font-size: 2.2rem;
              font-weight: 700;
              &:not(:last-child) {
                margin-bottom: .3rem;
              }
              &:nth-child(2n) {
                margin-left: .5rem;
              }
              .count {
                width: 6rem;
                height: 3.8rem;
                background: linear-gradient(180deg, #FFFFFF 0%, #DCDCDC 100%);
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .name {
                background: linear-gradient(180deg, rgba(34, 34, 34, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                width: 30rem;
              }
              p {
                margin: 0;
              }
            }
          }
        }
      }
    }
  }
  .name {
  }
</style>
