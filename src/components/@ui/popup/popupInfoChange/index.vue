<template>
      <div :class="$style.overlay" @click="$emit('closePopupInfoChange')">
        <div :class="$style.popupContainer" @click.stop>
          <v-icon :class="[$style.closeButton]" :name="'closePopup'" @click="$emit('closePopupInfoChange')"></v-icon>

          <div :class="$style.title">Редактирование {{$props.item.name}}</div>
           <!-- {{editedInfo}} -->

          <template v-if="$props.tableOptionsIndex !== 4 && $props.tableOptionsIndex !== 3">
            <div v-if="url" :class="$style.imgContainer">
              <div :class="$style.img">
                <img :src="url" />
              </div>
            </div>
            <input type="file" @change="onFileChange" />
          </template>

          <div :class="$style.eventsList" v-if="$props.tableOptionsIndex === 4">Доступные переменные:
            <span v-for="(item, index) in allKindsOfSport[currentSportId - 1].team_base_statistic" :key="index">{{item.name}} </span>
          </div>

          <div v-if="(!editedInfo.roleId && !editedInfo.date) || $props.tableOptionsIndex === 4" :class="$style.selectContainer">
            <select
              :class="$style.select"
              @input="setSportProperty"
            >
              <option :class="$style.optionItem" v-for="(item, index) in allKindsOfSport" :key="index" :selected="editedInfo.sportId === index + 1">
                {{item.name}}
              </option>
            </select>
            <v-icon :class="[$style.selectArrow]" :name="'selectArrow'"></v-icon>
          </div>


          <input v-if="(!editedInfo.roleId && !editedInfo.date) || $props.tableOptionsIndex === 4" v-model="editedInfo.name" type="text" placeholder="Название">

          <input v-if="$props.tableOptionsIndex === 4" v-model="editedInfo.user_friendly_formula_string" type="text" placeholder="Формула">

          <div v-if="!editedInfo.roleId && $props.tableOptionsIndex !== 4" :class="$style.radioContainer">
            <input v-model="editedInfo.moderation" type="checkbox" name="statistics" >
            <label :class="$style.label">Модерация</label>
          </div>

          <div v-if="editedInfo.roleId && !editedInfo.date" :class="$style.selectContainer">
            <select
              :class="$style.select"
              @input="setRoleProperty"
            >
              <option :class="$style.optionItem" v-for="(item, index) in roleArray" :selected="editedInfo.roleId === index + 1" :key="index">
                {{item}}
              </option>
            </select>
            <v-icon :class="[$style.selectArrow]" :name="'selectArrow'"></v-icon>
          </div>

          <v-btn @click="sendProperty" :color="'black'">
            Сохранить
          </v-btn>
        </div>
      </div>
</template>

<script>
/* eslint-disable */
import { ref, computed, onMounted, watch } from '@vue/composition-api'

export default {
    name: 'v-popupInfoChange',
    props: {
        item: {
          type: Object,
          default: () => {},
        },
        tableOptionsIndex: {
          type: Number,
          default: 0,
      },
    },
    setup(props, ctx) {
        const { emit } = ctx
        const store = ctx.root.$store
        const allKindsOfSport = computed(() => ctx.root.$store.state.allKindsOfSport)

        const file = ref()
        const url = ref()

        const editedInfo = ref(Object.assign({}, props.item))

        const roleArray = ref(['Админ', 'Оператор', 'Наблюдатель', 'Модератор'])

        const currentSportId = ref(props.item.sportId)

        const setSportProperty = (val) => {
          editedInfo.value.sportId = val.target.selectedIndex + 1
          currentSportId.value = val.target.selectedIndex + 1
        }

        const sendProperty = async () => {
          // if (file.value) {
          //   if (props.item.Files[0]) {
          //     const requestData = {
          //       fileName: props.item.Files[0].url,
          //     }
          //     await store.dispatch('deleteFile', requestData)
          //   }
          //   const requestData = {
          //     image: file.value,
          //     avatar: true,
          //   }
          //   if (props.tableOptionsIndex === 0) {
          //     requestData.matchId = editedInfo.value.id
          //   } else if (props.tableOptionsIndex === 1) {
          //     requestData.team_id = editedInfo.value.id
          //   } else if (props.tableOptionsIndex === 2) {
          //     requestData.leagueId = editedInfo.value.id
          //   }
          //   await store.dispatch('addFile', requestData)
          // }
          // if (props.tableOptionsIndex === 0) {
          //   emit('confirmMatchChange', editedInfo.value)
          // } else if (props.tableOptionsIndex === 1) {
          //   const data = {
          //     id: editedInfo.value.id,
          //     data: {
          //       name: editedInfo.value.name,
          //       sportId: editedInfo.value.sportId,
          //       moderation: editedInfo.value.moderation,
          //     },
          //   }
          //   emit('confirmTeamChange', data)
          // } else if (props.tableOptionsIndex === 2) {
          //   const data = {
          //     id: editedInfo.value.id,
          //     data: {
          //       name: editedInfo.value.name,
          //       sportId: editedInfo.value.sportId,
          //       moderation: editedInfo.value.moderation,
          //     },
          //   }
          //   emit('confirmLeagueChange', data)
          // } else if (props.tableOptionsIndex === 3) {
          //   emit('confirmRoleChange', roleProperty.value)
          // } else if (props.tableOptionsIndex === 4) {
          //   // console.log(Object.entries(allKindsOfSport.value[currentSportId.value - 1].team_base_statistic)[1].name)
          //   let editedFormula = editedInfo.value.user_friendly_formula_string
          //   Object.entries(allKindsOfSport.value[currentSportId.value - 1].team_base_statistic).map((item) => {
          //     editedFormula = editedFormula.replace(item[1].name, item[0]);
          //   })
          //   emit('editFormula', {
          //     sportId: currentSportId.value,
          //     user_friendly_formula_string: editedInfo.value.user_friendly_formula_string,
          //     formula_string: editedFormula,
          //     name: editedInfo.value.name,
          //   })
          // }
          if (props.tableOptionsIndex === 4) {
            editedInfo.value.sportId = currentSportId.value
          }
          emit('saveItem', editedInfo.value, file.value)
        }

        const onFileChange = (val) => {
          file.value = val.target.files[0]
          url.value = URL.createObjectURL(file.value)
        }

        const setRoleProperty = (val) => {
          editedInfo.value.roleId = val.target.selectedIndex + 1
        }

      onMounted(() => {
        if (!props.item.sportId) {
          currentSportId.value = 1
        }
        if (editedInfo.value.Files && editedInfo.value.Files.length) {
          url.value = `https://live-scout.c.roky.rocks/uploads/${editedInfo.value.Files[0].url}`
        }
      })


    return {
      allKindsOfSport,
      roleArray,
      currentSportId,

      editedInfo,

      onFileChange,
      url,
      file,

      setRoleProperty,
      setSportProperty,

      sendProperty,
    }
  },
}
</script>

<style lang="scss" module>
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  .popupContainer {
    width: 42.0rem;
    background: var(--white);
    border-radius: var(--border-radius);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 4rem 2rem 2.5rem;
    .closeButton {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 1.4rem;
      height: 1.4rem;
    }
    .title {
      text-align: center;
      font-weight: 700;
      @include button;
      margin-bottom: 1.7rem;
      color: var(--black);
    }
    .subtitle {
      font-weight: 400;
      @include text-small;
      margin-bottom: 1rem;
      opacity: 0.5;
      color: var(--black);
    }
  }
  .eventsList {
    @include teamName;
    margin-bottom: 2rem;
  }
  .selectContainer {
    position: relative;
    margin-bottom: 2rem;
    .select {
      position: relative;
      -webkit-appearance: none;
      -moz-appearance: none;
      border-radius: var(--border-radius);
      width: 100%;
      height: 5rem;
      border: none;
      outline: none;
      background: rgba(0, 0, 0, 0.05);
      padding: 0 1.5rem;
      font-weight: 400;
      @include text-small;
      cursor: pointer;
      color: var(--black);
      option {
        color: black;
      }
    }
    .selectArrow {
      position: absolute;
      top: 2.2rem;
      right: 1.5rem;
    }
  }
  input[type="text"] {
    background: rgba(0, 0, 0, 0.05);
    width: 100%;
    border-radius: var(--border-radius);
    outline: none;
    border: 0;
    height: 5rem;
    padding: 0 1.5rem;
    margin: 0rem 0 2rem;
    color: var(--black);
    font-weight: 400;
    @include text-small;
  }
  .radioContainer {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    input[type="checkbox"] {
      cursor: pointer;
      appearance: none;
      background-color: transparent;
      border: .2rem solid var(--black);
      // border-radius: 50%;
      width: 2.4rem;
      height: 2.4rem;
      padding: 0.4rem;
    }
    input[type="checkbox"]:checked {
      background: var(--black);
      background-clip: content-box;
    }
  }
}
.invert {
    filter: invert(1);
}
.imgContainer {
  width: 10rem;
  min-height: 10rem;
  max-height: 15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  .img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
input[type="file"] {
  width: 100%;
  margin-bottom: 2rem;
}


</style>
