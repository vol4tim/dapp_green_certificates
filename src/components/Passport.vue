<template>
  <v-list two-line>
    <v-list-tile avatar :href="`https://etherscan.io/address/${data.liability}`" target="__blank">
      <v-list-tile-avatar>
        <img :src="icon(data.liability)">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>Уникальный номер сертификата</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.liability }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar :href="`https://ipfs.io/ipfs/${data.result}`" target="__blank">
      <v-list-tile-avatar>
        <img :src="icon(data.result)">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>Лог от IoT счётчика доступен в IPFS по ссылке</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.result }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar :href="`https://etherscan.io/address/${data.promisee}`" target="__blank">
      <v-list-tile-avatar>
        <img :src="icon(data.promisee)">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>Информация о владельце выпускаемого сертификата</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.promisee }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar :href="`https://etherscan.io/token/${data.token}`" target="__blank">
      <v-list-tile-avatar>
        <img :src="icon(data.token)">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>Создан реестр зеленых сертификатов по адресу</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.token }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile
      avatar
      v-if="data.tx"
      :href="`https://etherscan.io/tx/${data.tx}`"
      target="__blank"
    >
      <v-list-tile-avatar>
        <img :src="icon(data.tx)">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>Выполнена транзакция на выдачу зеленого сертификата</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.tx }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar :href="`https://etherscan.io/address/${data.promisor}`" target="__blank">
      <v-list-tile-avatar>
        <img :src="icon(data.promisor)">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>Должностное лицо осуществившее операцию в реестре</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.promisor }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Дата выдачи сертификата</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.date }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Срок действия сертификата, определённый путём указания календарной даты истечения срока</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.validity }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Период, в течение которого была произведена электроэнергия</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.dates }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Объем электрической энергии, на который выдан сертификат, МВт*ч</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.mvt }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Вид возобновляемого источника энергии</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.type }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Сведения, однозначно определяющие генерирующий объект</v-list-tile-title>
        <v-list-tile-sub-title>Фотоэлектрическая установка, установленная на южном фасаде здания «Гиперкуб» (Инновационный центр «Сколково»)</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Установленная мощность генерирующего объекта</v-list-tile-title>
        <v-list-tile-sub-title>Установленная мощность ФЭС составляет 11 кВт. Фотоэлектрические модули (далее – ФЭМ) в количестве 88 шт. ориентированы на юг и размещены на фасаде (вертикально)</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Указание на наличие или отсутствие государственной поддержки, предоставленной в отношении генерирующего объекта за период времени, в течение которого была осуществлена выработка электроэнергии, форма и объём этой поддержки</v-list-tile-title>
        <v-list-tile-sub-title>Отсутствует</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Коэффициенты (удельные объёмы) вредных выбросов, связываемых с генерацией</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.kf }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar href="https://yandex.ru/maps/-/CCSX5God" target="__blank">
      <v-list-tile-content>
        <v-list-tile-title>Наименование и место нахождения (в том числе географические координаты) генерирующего объекта</v-list-tile-title>
        <v-list-tile-sub-title>Установлена на южном фасаде здания «Гиперкуб» (Инновационный центр «Сколково») 55.696608, 37.356075</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Идентификатор генерирующего объекта</v-list-tile-title>
        <v-list-tile-sub-title>н/д</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Дата ввода генерирующего объекта в эксплуатацию</v-list-tile-title>
        <v-list-tile-sub-title>{{ data.dateObject }}</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>

    <v-list-tile avatar>
      <v-list-tile-content>
        <v-list-tile-title>Проверка по открытым источникам данных</v-list-tile-title>
        <v-list-tile-sub-title>успешно</v-list-tile-sub-title>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>
</template>

<script>
import makeBlockie from "ethereum-blockies-base64";

export default {
  props: ["data"],
  // data() {
  //   return {
  //     liability: "0x123",
  //     result: "Qmsd",
  //     tx: "0x1231",
  //     token: "0x1231",
  //     promisor: "0x1",
  //     promisee: "0x2",
  //     date: "10.02.2019",
  //     validity: "3 года",
  //     dates: "01 - 30 мая 2019 года",
  //     mvt: "100",
  //     type: "Энергия солнца",
  //     kf: "0",
  //     dateObject: "Август 2012 года"
  //   };
  // },
  methods: {
    icon(address) {
      return makeBlockie(address);
    }
  }
};
</script>
