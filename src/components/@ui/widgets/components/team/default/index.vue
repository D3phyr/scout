<template>
  <div :class="[$style.online, $style.widget]">
    <div :class="$style.wrap">
      <div :class="$style.content">
        <div :style="{ color: color }" :class="$style.name">
          Состав команды
          <span>{{ widgetData.statistics[team].name }}</span>
        </div>
        <div v-if="team1" :class="$style.list">
          <div v-for="(item, index) in team1.Players" :key="index" :class="$style.player">
            <div :class="$style.count">
              <p>{{ item.points }}</p>
            </div>
            <div :class="$style.title">
              <p>{{ item.name }}</p>
            </div>
          </div>
        </div>
        <div v-if="team1.Trainers[0]" :class="$style.coach">
          Главный тренер –
          <span>
            {{ team1.Trainers[0][0] }}
          </span>
        </div>
        <!--<div :class="$style.events">-->
          <!--<p>s</p>-->
          <!--<div v-for="(item, index) in 8" :key="index" :class="$style.event">

            <div :class="$style.count">
              <p>100</p>
            </div>
            <div :class="$style.name">
              <p>2-x очковые (%)</p>
            </div>
            <div :class="$style.count">
              <p>100</p>
            </div>
          </div>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import {} from '@vue/composition-api'

export default {
  name: 'widget-team',
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
    team: {
      type: String,
      default: 'Side_1',
    },
    color: {
      type: String,
      default: '',
    },
  },
  computed: {
    team1() {
      console.log('team1')
      console.log(this.team)
      console.log(this.widgetData.statistics)
      console.log(this.widgetData.statistics[this.team])
      if (this.widgetData.statistics[this.team]) {
        return this.widgetData.statistics[this.team]
      } else {
        return false
      }
    },
    team2() {
      return this.team
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
            font-size: 1.4rem;
            &:not(:nth-child(3n)) {
              margin-right: .85rem;
            }
            .count {
              width: 6rem;
              height: 3.4rem;
              background: linear-gradient(180deg, #FFFFFF 0%, #DCDCDC 100%);
              display: flex;
              font-weight: 700;
              justify-content: center;
              align-items: center;
              font-size: 1.8rem;
            }
            .title {
              background: linear-gradient(180deg, rgba(34, 34, 34, 0.9) 0%, rgba(0, 0, 0, 0.9) 100%);
              display: flex;
              align-items: center;
              justify-content: flex-start;
              color: #fff;
              width: 22.855rem;
              padding-left: .8rem;
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
