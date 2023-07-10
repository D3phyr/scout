<template>
  <div :class="[$style.online, $style.widget]">
    <div :class="$style.wrap">
      <div :class="$style.content">
        <div :style="{ color: color }" :class="$style.name">
          Судейская бригада
          <!--<span>Локомотив</span>-->
        </div>
        <div :class="$style.list">
          <div v-for="(item, index) in widgetData.statistics.Referee" :key="index" :class="$style.player">
            <!--<div :class="$style.count">
              <p>100</p>
            </div>-->
            <div :class="$style.title">
              <p>{{ item[0] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {} from '@vue/composition-api'

export default {
  name: 'widget-judges',
  components: {
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
        .name {
          color: #FF2626;
          display: flex;
          align-items: center;
          font-weight: 700;
          background: linear-gradient(180deg, rgba(34, 34, 34, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%);
          height: 3.7rem;
          padding: 0 1rem;
          margin: 0 0 1rem 0;
          span {
            color: #fff;
            margin-left: 1rem;
          }
        }
        .list {
          display: flex;
          flex-wrap: wrap;
          .player {
            display: flex;
            margin-bottom: .2rem;
            font-size: 1.6rem;
            height: 3.8rem;
            &:not(:nth-child(3n)) {
              margin-right: .85rem;
            }
            .count {
              width: 6rem;
              height: 3.8rem;
              background: linear-gradient(180deg, #FFFFFF 0%, #DCDCDC 100%);
              display: flex;
              font-weight: 700;
              justify-content: center;
              align-items: center;
            }
            .title {
              background: linear-gradient(180deg, rgba(34, 34, 34, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%);
              display: flex;
              align-items: center;
              justify-content: flex-start;
              color: #fff;
              width: 22.855rem;
              padding-left: .6rem;
              font-weight: 700;
            }
            p {
              margin: 0;
            }
          }

        }
        .coach {
          display: flex;
          align-items: center;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(180deg, rgba(34, 34, 34, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%);
          height: 3.7rem;
          padding: 0 1rem;
          margin-top: 1.5rem;
          span {
            margin-left: 1rem;
          }
        }
      }
    }
  }
  .name {
  }
</style>
