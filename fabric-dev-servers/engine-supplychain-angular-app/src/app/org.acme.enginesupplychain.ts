import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.acme.enginesupplychain{
   export class EngineProperties {
      brand: string;
      model: string;
      horsePower: number;
      cubicCapacity: number;
      cylindersAmount: number;
   }
   export class Address {
      country: string;
      city: string;
      street: string;
      streetNo: string;
   }
   export class Engine extends Asset {
      engineId: string;
      data: EngineProperties;
      manufacturer: Manufacturer;
      currentCar: Car;
      merchant: Merchant;
   }
   export class Car extends Asset {
      carId: string;
      legalDocumentId: string;
   }
   export class Member extends Participant {
      memberId: string;
      name: string;
      address: Address;
   }
   export class Manufacturer extends Member {
   }
   export class Merchant extends Member {
   }
   export class EngineMerchantTransfer extends Transaction {
      engine: Engine;
      merchant: Merchant;
   }
   export class EngineCarInstallation extends Transaction {
      engine: Engine;
      car: Car;
   }
   export class EngineCreation extends Transaction {
      manufacturer: Manufacturer;
      data: EngineProperties;
   }
   export class CarCreation extends Transaction {
      legalIdDocument: string;
   }
// }
