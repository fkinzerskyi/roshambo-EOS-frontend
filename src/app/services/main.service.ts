import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import Eos from "eosjs";
import EosJSecc from "eosjs-ecc";
import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs";
import { Router } from "@angular/router";
import { LoginEOSService } from "eos-ulm";

@Injectable({
  providedIn: "root",
})
export class MainService {
  WINDOW: any = window;
  // eos = this.WINDOW.Eos(environment.Eos);
  // eos;
  accountName: any = "";
  GAMES_C = [];
  GAMES_M = [];
  move = {};
  nonce = {};
  navigator: any = navigator;
  eos = Eos(environment.Eos);
  ScatterJS = ScatterJS;
  // scatterJS;
  // ScatterEOS;

  constructor(private router: Router, public loginEOSService: LoginEOSService) {
    // this.eos = Eos(environment.Eos);
    // this.scatterJS = ScatterJS.plugins(new ScatterEOS());
    this.ScatterJS.plugins(new ScatterEOS());
    // this.WINDOW.ScatterJS.plugins(new this.WINDOW.ScatterEOS());
  }

  showErr(error) {
    let error_;
    try {
      error_ = JSON.parse(error);
    } catch (e) {
      return console.error(error_);
    }
    this.WINDOW.UIkit.notification({
      message: error_.error.details[0].message,
      status: "danger",
      pos: "top-center",
      timeout: 3000,
    });
  }

  createGame(challenger) {
    if (!challenger || challenger.length !== 12) {
      this.WINDOW.UIkit.notification({
        message: "Incorrect EOS account",
        status: "danger",
        pos: "top-center",
        timeout: 3000,
      });
      return;
    }
    if (challenger === this.loginEOSService.accountName) {
      this.WINDOW.UIkit.notification({
        message: "Account can't be the same",
        status: "danger",
        pos: "top-center",
        timeout: 3000,
      });
      return;
    }
    if (challenger.length !== 12) {
      this.WINDOW.UIkit.notification({
        message: "Account name must be 12 characters!",
        status: "danger",
        pos: "top-center",
        timeout: 3000,
      });
      return;
    }
    this.setPlayer(challenger);

    let actions = [
      {
        account: environment.gcontract,
        name: "create",
        authorization: [
          {
            actor: this.loginEOSService.accountName,
            permission: "active",
          },
        ],
        data: {
          host: this.loginEOSService.accountName,
          challenger,
        },
      },
    ];
    this.loginEOSService.eos
      .transaction({ actions })
      .then((res) => {
        try {
          this.findGame(challenger);
        } catch (err) {
          this.loginEOSService.contractError(err);
        }
      })
      .catch((err) => {
        let errorObj;
        try {
          errorObj = JSON.parse(err);
        } catch (err) {
          this.loginEOSService.showMessage(err);
          return;
        }
        const erroeMsg = errorObj.error.details[0].message;
        const userExist = "There is open game with this user";
        if (erroeMsg.includes(userExist)) {
          for (let game of this.GAMES_C) {
            if (game.host === challenger) {
              let url = `/call/${game.host}/${game.id}`;
              this.router.navigate([url]);
              return null;
            }
          }
          for (let game of this.GAMES_M) {
            if (game.challenger === challenger) {
              let url = `/mygame/${game.challenger}/${game.id}`;
              this.router.navigate([url]);
              return null;
            }
          }
        }

        this.WINDOW.UIkit.notification({
          message: "There is open game!",
          status: "danger",
          pos: "top-center",
          timeout: 3000,
        });
      });
  }

  findGame(challenger) {
    let found = false;
    this.GAMES_M.forEach((elem) => {
      if (elem.challenger === challenger) {
        found = true;
        let url = `/mygame/${challenger}/${elem.id}`;
        this.router.navigate([url]);
      }
    });
    if (!found) {
      setTimeout(() => {
        this.findGame(challenger);
      }, 200);
    }
  }

  getGameChallenges(callback) {
    if (!this.loginEOSService.accountName) {
      return;
    }
    this.eos
      .getTableRows({
        json: true,
        scope: environment.gcontract,
        code: environment.gcontract,
        table: "games",
        limit: 100,
        table_key: "host",
        lower_bound: this.loginEOSService.accountName,
        upper_bound: this.loginEOSService.accountName + "a",
        key_type: "i64",
        index_position: 2,
      })
      .then((res: any) => {
        this.GAMES_M = res.rows;
        callback(null, this.GAMES_M);
      })
      .catch((err) => {
        callback(err);
      });
  }

  getMyGamesCalls(callback) {
    if (!this.loginEOSService.accountName) {
      return;
    }
    this.eos
      .getTableRows({
        json: true,
        scope: environment.gcontract,
        code: environment.gcontract,
        table: "games",
        limit: 100,
        table_key: "challenger",
        lower_bound: this.loginEOSService.accountName,
        upper_bound: this.loginEOSService.accountName + "a",
        key_type: "i64",
        index_position: 3,
      })
      .then((res: any) => {
        this.GAMES_C = res.rows;
        callback(null, this.GAMES_C);
      })
      .catch((err) => {
        callback(err);
      });
  }

  closeGame(id) {
    let actions = [
      {
        account: environment.gcontract,
        name: "close",
        authorization: [
          {
            actor: this.loginEOSService.accountName,
            permission: "active",
          },
        ],
        data: {
          host: this.loginEOSService.accountName,
          id,
        },
      },
    ];
    this.loginEOSService.eos
      .transaction({ actions })
      .then((res) => {
        this.router.navigate(["/"]);
      })
      .catch((err) => {
        this.loginEOSService.contractError(err);
      });
  }
  restart(id, challenger) {
    let actions = [
      {
        account: environment.gcontract,
        name: "restart",
        authorization: [
          {
            actor: this.loginEOSService.accountName,
            permission: "active",
          },
        ],
        data: {
          host: this.loginEOSService.accountName,
          id,
        },
      },
    ];
    this.loginEOSService.eos
      .transaction({ actions })
      .then((res) => {
        try {
          this.GAMES_M = [];
          this.findGame(challenger);
        } catch (err) {
          this.loginEOSService.contractError(err);
        }
      })
      .catch((err) => {
        console.error(err);
        this.loginEOSService.contractError(err);
      });
  }

  move01(id, move_, challenger, by) {
    let host = this.loginEOSService.accountName;
    this.move[host] = move_;
    this.nonce[host] = Math.floor(Math.random() * 100000000 + 1);

    this.setGame(`rps_${id}_move`, this.move[host]);
    this.setGame(`rps_${id}_nonce`, this.nonce[host]);

    let my_move = this.move[host] + "" + this.nonce[host];
    let move_hash = EosJSecc.sha256(my_move);
    let by_name = by === 1 ? host : challenger;

    let actions = [
      {
        account: environment.gcontract,
        name: "move1",
        authorization: [
          {
            actor: this.loginEOSService.accountName,
            permission: "active",
          },
        ],
        data: {
          id,
          by: by_name,
          move_hash,
        },
      },
    ];
    this.loginEOSService.eos
      .transaction({ actions })
      .then((res) => {})
      .catch((err) => {
        this.loginEOSService.contractError(err);
      });
  }

  move02(id, challenger, by) {
    let host = this.loginEOSService.accountName;
    let by_name = by === 1 ? host : challenger;

    if (!this.nonce[host]) {
      this.nonce[host] = Number(this.getGame(`rps_${id}_nonce`));
    }
    if (!this.move[host]) {
      this.move[host] = Number(this.getGame(`rps_${id}_move`));
    }

    let actions = [
      {
        account: environment.gcontract,
        name: "move2",
        authorization: [
          {
            actor: this.loginEOSService.accountName,
            permission: "active",
          },
        ],
        data: {
          id,
          by: by_name,
          pmove: this.move[host],
          pmove_nonce: this.nonce[host],
        },
      },
    ];
    this.loginEOSService.eos
      .transaction({ actions })
      .then((res) => {
        try {
          this.clearCachedGames(id);
        } catch (err) {
          this.loginEOSService.contractError(err);
        }
      })
      .catch((err) => {
        this.loginEOSService.contractError(err);
      });
  }

  setGame(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
  }

  getGame(cname) {
    return localStorage.getItem(cname);
  }

  clearCachedGames(id) {
    for (var i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i).indexOf(`rps_${id}`) >= 0) {
        localStorage.removeItem(localStorage.key(i));
      }
    }
  }

  setPlayer(name) {
    let namesArr = localStorage.getItem("players");
    if (!namesArr) {
      localStorage.setItem("players", name);
      return;
    } else if (namesArr.indexOf(name) >= 0) {
      return;
    }
    namesArr = namesArr + "," + name;
    localStorage.setItem("players", namesArr);
  }

  copyToClipboard(text) {
    this.navigator.clipboard.writeText(text).then(
      () => {
        this.WINDOW.UIkit.notification({
          message: "Copying to clipboard was successful!",
          status: "success",
          pos: "top-center",
          timeout: 3000,
        });
      },
      (err) => {
        this.WINDOW.UIkit.notification({
          message: "Could not copy text",
          status: "danger",
          pos: "top-center",
          timeout: 3000,
        });
      }
    );
  }

  // ==== service end
}
