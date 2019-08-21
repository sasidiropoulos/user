import { Component, OnInit } from '@angular/core';
import * as jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuctionService } from '../_services';
import { AlertService } from '../_alert';
import { Auction } from '../_models';

@Component({
  selector: 'app-manage-auctions',
  templateUrl: './manage-auctions.component.html',
  styleUrls: ['./manage-auctions.component.css']
})
export class ManageAuctionsComponent implements OnInit {
  openform: boolean;
  userId: any;
  auctionForm: FormGroup;
  loading = false;
  submitted = false;
  public lat: any;
  public lng: any;
  myAuctions: Auction[];

  constructor(
    private formBuilder: FormBuilder,
    private auctionService: AuctionService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.openform = false;

    let currentUserJSON = JSON.parse(localStorage.getItem('currentUser'));
    let tokenInfo = jwt_decode(currentUserJSON.token);
    this.userId = tokenInfo.userId;

    this.auctionForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      location: ['', Validators.required],
      country: ['', Validators.required],
      currently: ['', Validators.required],
      started: ['', Validators.required],
      ends: ['', Validators.required],
      description: ['', Validators.required],
      seller: [this.userId]
    });

    this.loadAllAuctions();
  }

  // convenience getter for easy access to form fields
  get f() { return this.auctionForm.controls; }

  formSubmit() {
    // Setting the location based on the users actual location
    // if (this.auctionForm.value.location === "") {
    //   this.auctionForm.value.location = this.lng + " " + this.lat;
    // }

    // console.log(this.auctionForm.value.location);

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.auctionForm.invalid) {
      return;
    }

    this.loading = true;
    this.auctionService.newForm(this.auctionForm.value)
      .pipe(first())
      .subscribe(
        data => {
          window.location.reload();
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  // Toggles the new auction form on click
  onClickToggleForm() {
    this.getLocation();

    this.openform = !this.openform;
    return this.openform;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        }
      },
        (error: PositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  private loadAllAuctions() {
    this.auctionService.getAll().pipe(first()).subscribe(res => {
      let newObj: any = res;
      this.myAuctions = newObj.auctions;
    });
  }
}
