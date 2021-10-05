import {Component, OnInit} from '@angular/core';

import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {User} from './Users';
import {holder} from './Users';
import {Bannedholder} from './Users';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  Korisnici: holder;
  BannedKorisnici: holder;
  userkorisnik: User | null = null;
  search: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  total: number;
  PrikaziModal: User | null;
  banreason?: any;
  bandays?: any;
  bannedrequest: boolean = false;
  toggled: boolean = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.PreuzmiPodatke()
  }

  PreuzmiPodatke() {
    this.http.get<holder>("https://p1752.app.fit.ba/Admin/GetUsers?currentpage=" + this.currentPage + "&q=" + this.search).subscribe((result) => {
      /* this.userkorisnik=result;*/
      this.Korisnici = result;
      this.Korisnici.users = result.users;
      this.total = result.broj;

      console.log(this.Korisnici);
    });

  }

  banaj(s: User) {
    var httpOption = {
      headers: new HttpHeaders({"content-type": "application/json"})
    }
    this.http.get<any>("https://p1752.app.fit.ba/Admin/BanUser?banid=" + s.userID + "&days=" + this.bandays + "&reason=" + this.banreason).subscribe((result) => {
      let temp: string = result.days + 1;
      let indexof = this.Korisnici.users.indexOf(s);
      this.Korisnici.users.splice(indexof, 1);
      alert('banned ' + s.username + ' for : ' + temp.toString().substr(0, 3) + ' days');
    });
    this.PrikaziModal = null;
    this.banreason = null;
    this.bandays = null;
    window.location.reload();
  }

  GetKorisnici() {
    return this.Korisnici.users//.filter((a: { username: string; })=>a.username.startsWith(this.search))
  }

  pagenumberchange($event: any) {
    this.PreuzmiPodatke()
  }

  banpagenumberchange($event: any) {

    this.http.get<holder>("https://p1752.app.fit.ba/Admin/Getbanned?currentpage=" + this.currentPage + "&q=" + this.search).subscribe((result) => {
      /* this.userkorisnik=result;*/
      this.BannedKorisnici = result;
      this.BannedKorisnici.users = result.users;
      this.total = result.broj;
      this.toggled = true;

      return this.BannedKorisnici.users;


    });
  }

  trazibutton() {
    this.currentPage = 1;
    this.PreuzmiPodatke();


  }

  trazibanned() {
    this.currentPage = 1;
    this.http.get<holder>("https://p1752.app.fit.ba/Admin/Getbanned?currentpage=" + this.currentPage + "&q=" + this.search).subscribe((result) => {
      /* this.userkorisnik=result;*/
      this.BannedKorisnici = result;
      this.BannedKorisnici.users = result.users;
      this.total = result.broj;
      this.toggled = true;

      return this.BannedKorisnici.users;


    });


  }

  getvalueforbandays(val: string) {
    this.bandays = val;
  }

  getvalueforreason(val: string) {
    this.banreason = val;

  }

  GetBanned() {
    if (this.bannedrequest == true) {
      this.bannedrequest = false;
      this.toggled = false;
      return this.PreuzmiPodatke();

    }
    this.bannedrequest = true;
    this.http.get<holder>("https://p1752.app.fit.ba/Admin/Getbanned?currentpage=" + this.currentPage + "&q=" + this.search).subscribe((result) => {
      /* this.userkorisnik=result;*/
      this.BannedKorisnici = result;
      this.BannedKorisnici.users = result.users;
      this.total = result.broj;
      this.toggled = true;

      return this.BannedKorisnici.users;


    });


  }

  GetBannedKorisnici() {
    return this.BannedKorisnici.users//.filter((a: { username: string; })=>a.username.startsWith(this.search))
  }

  unban(s: User) {
    var httpOption = {
      headers: new HttpHeaders({"content-type": "application/json"})
    }
    this.http.get<any>("https://p1752.app.fit.ba/Admin/Unban?q=" + s.userID).subscribe((result) => {

      let indexof = this.BannedKorisnici.users.indexOf(s);
      this.BannedKorisnici.users.splice(indexof, 1);
      alert('unbanned ' + s.username);
      window.location.reload();
    });
  }

  GetReport() {
    let url = "https://p1752.app.fit.ba/Admin/GetReport";
    window.open(url, "_blank");
  }

}

