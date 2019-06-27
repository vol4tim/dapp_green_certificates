<template>
  <v-flex md12>
    <v-card>
      <v-card-text>
        <h2>Паспорт</h2>
        <v-progress-linear v-if="passport.status == 'load'" :indeterminate="true"></v-progress-linear>
        <div v-else>
          <Passport :data="passport"/>
          <div v-if="passport.status=='new'">
            <v-btn
              color="success"
              @click="confirm(passport.liability, true)"
              :disabled="$wait.is(actionTx)"
            >Подтвердить</v-btn>
            <v-btn
              v-if="!$wait.is(actionTx)"
              color="warning"
              @click="confirm(passport.liability, false)"
            >Отклонить</v-btn>
          </div>

          <v-list two-line v-if="passport.status!='new'">
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>Статус</v-list-tile-title>
                <v-list-tile-sub-title v-if="passport.status=='confirm'">Ожидает подтверждения</v-list-tile-sub-title>
                <v-list-tile-sub-title v-if="passport.status=='drop'">Отклонено</v-list-tile-sub-title>
                <v-list-tile-sub-title v-if="passport.status=='finish'">Подтвержденно</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-flex>
</template>

<script>
import { Liability, Token } from "robonomics-js";
import * as config from "../config";
import Passport from "./Passport";
import getIpfs from "../utils/ipfs";
import rosBag from "../utils/rosBag";

export default {
  components: { Passport },
  data() {
    return {
      account: "",
      actionTx: "",
      passport: {
        status: "load",
        liability: null,
        result: null,
        tx: null,
        token: null,
        promisor: null,
        promisee: null,
        date: null,
        validity: "3 года",
        dates: null,
        mvt: null,
        type: "Энергия солнца",
        kf: "0",
        dateObject: "Август 2012 года"
      }
    };
  },
  mounted() {
    this.account = this.$robonomics.account.address;
    this.$robonomics.onResult(msg => {
      console.log("result unverified", msg);
      if (
        this.passport.result === null &&
        this.passport.liability === msg.liability
      ) {
        const liability = new Liability(
          this.$robonomics.web3,
          msg.liability,
          "0x0000000000000000000000000000000000000000"
        );
        liability.getInfo().then(info => {
          console.log("getInfo()", info);
          if (
            info.validator ===
            this.$robonomics.web3.toChecksumAddress(config.VALIDATOR)
          ) {
            this.passport.result = msg.result;
            this.rosbag();
          }
        });
      }
    });
    this.$robonomics.onLiability((err, liability) => {
      liability.getInfo().then(info => {
        if (info.model === config.MODEL) {
          this.passport.liability = this.$robonomics.web3.toChecksumAddress(
            liability.address
          );
          this.passport.promisor = info.promisor;
          this.passport.promisee = info.promisee;
          this.passport.date = new Date().toLocaleDateString();
        }
      });
      liability.onResult().then(result => {
        console.log("liability.onResult()", result);
        this.setResult(liability.address, result, true);
      });
    });
  },
  methods: {
    rosbag() {
      const li = this.passport.liability;
      getIpfs()
        .then(ipfs => ipfs.cat(this.passport.result))
        .then(r => {
          return rosBag(
            new Blob([r]),
            bag => {
              if (bag.topic === "/liability/eth_" + li + "/period") {
                this.passport.dates = bag.message.data;
              } else if (
                bag.topic ===
                "/liability/eth_" + li + "/total_production"
              ) {
                this.passport.mvt = bag.message.data;
              } else if (bag.topic === "/liability/eth_" + li + "/token") {
                this.passport.token = bag.message.data;
              }
            },
            {
              topics: [
                "/liability/eth_" + li + "/period",
                "/liability/eth_" + li + "/total_production",
                "/liability/eth_" + li + "/token"
              ]
            }
          );
        })
        .then(() => {
          this.passport.status = "new";
        });
    },
    sendDemand() {
      this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
        const msg = {
          model: config.MODEL,
          objective: config.OBJECTIVE,
          token: this.$robonomics.xrt.address,
          cost: config.PRICE,
          lighthouse: this.$robonomics.lighthouse.address,
          validator: config.VALIDATOR,
          validatorFee: 0,
          deadline: r.number + 1000
        };

        this.$robonomics.sendDemand(msg).then(liability => {
          console.log(liability.address);
        });
      });
    },
    setResult(address, result, check = true) {
      console.log("setResult", address, result, check);
      // if (this.liability.address === address) {
      //   this.liability.result = result;
      //   this.liability.check = check;
      // }
    },
    confirm(address, status) {
      console.log("confirm", address);
      console.log("confirm", this.passport);
      if (!status) {
        this.passport.status = "drop";
        return;
      }
      const token = new Token(this.$robonomics.web3, config.TOKEN);
      window.token = token;
      token.send
        .mint(
          this.passport.promisee,
          this.passport.mvt,
          { from: this.$robonomics.account.address },
          (e, r) => {
            if (e) {
              return;
            }
            this.actionTx = "tx." + r;
            this.$wait.start(this.actionTx);
            this.passport.tx = r;
          }
        )
        .then(() => {
          return this.$robonomics.sendResult({
            liability: address,
            success: true,
            result: this.passport.result
          });
        })
        .then(() => {
          this.passport.status = "confirm";
          this.$wait.end(this.actionTx);
          this.actionTx = "";
          const liability = new Liability(
            this.$robonomics.web3,
            address,
            "0x0000000000000000000000000000000000000000"
          );
          return liability.onResult();
        })
        .then(() => {
          this.passport.status = "finish";
        })
        .catch(e => {
          console.log(e);
          this.$wait.end(this.actionTx);
          this.actionTx = "";
        });
    }
  }
};
</script>
