/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { EngineService } from './Engine.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-engine',
  templateUrl: './Engine.component.html',
  styleUrls: ['./Engine.component.css'],
  providers: [EngineService]
})
export class EngineComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  engineId = new FormControl('', Validators.required);
  data = new FormControl('', Validators.required);
  manufacturer = new FormControl('', Validators.required);
  currentCar = new FormControl('', Validators.required);
  merchant = new FormControl('', Validators.required);

  constructor(public serviceEngine: EngineService, fb: FormBuilder) {
    this.myForm = fb.group({
      engineId: this.engineId,
      data: this.data,
      manufacturer: this.manufacturer,
      currentCar: this.currentCar,
      merchant: this.merchant
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceEngine.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.acme.enginesupplychain.Engine',
      'engineId': this.engineId.value,
      'data': this.data.value,
      'manufacturer': this.manufacturer.value,
      'currentCar': this.currentCar.value,
      'merchant': this.merchant.value
    };

    this.myForm.setValue({
      'engineId': null,
      'data': null,
      'manufacturer': null,
      'currentCar': null,
      'merchant': null
    });

    return this.serviceEngine.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'engineId': null,
        'data': null,
        'manufacturer': null,
        'currentCar': null,
        'merchant': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.acme.enginesupplychain.Engine',
      'data': this.data.value,
      'manufacturer': this.manufacturer.value,
      'currentCar': this.currentCar.value,
      'merchant': this.merchant.value
    };

    return this.serviceEngine.updateAsset(form.get('engineId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceEngine.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceEngine.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'engineId': null,
        'data': null,
        'manufacturer': null,
        'currentCar': null,
        'merchant': null
      };

      if (result.engineId) {
        formObject.engineId = result.engineId;
      } else {
        formObject.engineId = null;
      }

      if (result.data) {
        formObject.data = result.data;
      } else {
        formObject.data = null;
      }

      if (result.manufacturer) {
        formObject.manufacturer = result.manufacturer;
      } else {
        formObject.manufacturer = null;
      }

      if (result.currentCar) {
        formObject.currentCar = result.currentCar;
      } else {
        formObject.currentCar = null;
      }

      if (result.merchant) {
        formObject.merchant = result.merchant;
      } else {
        formObject.merchant = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'engineId': null,
      'data': null,
      'manufacturer': null,
      'currentCar': null,
      'merchant': null
      });
  }

}
