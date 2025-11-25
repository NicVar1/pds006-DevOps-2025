import { Computer, DeviceCriteria, DeviceId, EnteredDevice, FrequentComputer, MedicalDevice } from "@/core/domain"
import { SERVICE_ERRORS } from "@/core/service/error"
import { DeviceRepository } from "@core/repository"

export class InMemoryDeviceRepository implements DeviceRepository {
  private frequentComputers = new Map<DeviceId, FrequentComputer>()
  private medicalDevices = new Map<DeviceId, MedicalDevice>()
  private computers = new Map<DeviceId, Computer>()
  private enteredDevices = new Map<DeviceId, EnteredDevice>()

  async registerFrequentComputer(computer: FrequentComputer): Promise<FrequentComputer> {
    this.frequentComputers.set(computer.device.id, computer)
    return computer
  }

  async getMedicalDevices(_criteria: DeviceCriteria): Promise<MedicalDevice[]> {
    return Array.from(this.medicalDevices.values())
  }

  async getComputers(criteria: DeviceCriteria): Promise<Computer[]> {
    let results = Array.from(this.computers.values());

    // FILTER BY (including nested fields e.g., owner.id)
    if (criteria?.filterBy) {
      const { field, value } = criteria.filterBy;

      results = results.filter((device) => {
        const nestedValue = field
          .split(".")
          .reduce((obj, key) => (obj as any)?.[key], device as any);

        return nestedValue === value;
      });
    }

    // SORTING (supports ascending/descending)
    if (criteria?.sortBy) {
      const { field, isAscending } = criteria.sortBy;

      results.sort((a, b) => {
        const av = field.split(".").reduce((obj, key) => (obj as any)?.[key], a as any);
        const bv = field.split(".").reduce((obj, key) => (obj as any)?.[key], b as any);

        if (av instanceof Date && bv instanceof Date)
          return isAscending ? av.getTime() - bv.getTime() : bv.getTime() - av.getTime();

        return isAscending ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });
    }

    // ✅ PAGINATION
    if (criteria?.offset !== undefined) results = results.slice(criteria.offset);
    if (criteria?.limit !== undefined) results = results.slice(0, criteria.limit);

    return results;
  }


  async getFrequentComputers(_criteria: DeviceCriteria): Promise<FrequentComputer[]> {
    return Array.from(this.frequentComputers.values())
  }

  async getEnteredDevices(_criteria: DeviceCriteria): Promise<EnteredDevice[]> {
    return Array.from(this.enteredDevices.values())
  }

  async checkinComputer(computer: Computer): Promise<Computer> {
    this.computers.set(computer.id, computer)
    this.enteredDevices.set(computer.id, this.mapDeviceFromComputer(computer))

    return computer
  }

  async checkinMedicalDevice(device: MedicalDevice): Promise<MedicalDevice> {
    this.medicalDevices.set(device.id, device)
    this.enteredDevices.set(device.id, this.mapDeviceFromMedical(device))

    return device
  }

  async checkinFrequentComputer(id: DeviceId, datetime: Date): Promise<FrequentComputer> {
    if (!this.frequentComputers.has(id)) {
      throw SERVICE_ERRORS.DeviceNotFound
    }

    const computer = this.frequentComputers.get(id)!

    computer.device.checkinAt = datetime
    computer.device.updatedAt = datetime

    this.enteredDevices.set(id, this.mapDeviceFromFrequentComputer(computer))

    return computer
  }

  async checkoutDevice(id: DeviceId, datetime: Date): Promise<void> {
    if (!this.enteredDevices.has(id)) {
      throw SERVICE_ERRORS.DeviceNotFound
    }

    const device = this.enteredDevices.get(id)!

    switch (device.type) {
      case "computer":
        this.computers.get(id)!.checkoutAt = datetime
        break;
      case "medical-device":
        this.medicalDevices.get(id)!.checkoutAt = datetime
        break;
      case "frequent-computer":
        this.frequentComputers.get(id)!.device.checkoutAt = datetime
        break;
    }

    this.enteredDevices.delete(id)
  }

  async isDeviceEntered(id: DeviceId): Promise<boolean> {
    return this.enteredDevices.has(id)
  }

  async isFrequentComputerRegistered(id: DeviceId): Promise<boolean> {
    return this.frequentComputers.has(id)
  }

  private mapDeviceFromFrequentComputer(computer: FrequentComputer): EnteredDevice {
    return {
      id: computer.device.id,
      brand: computer.device.brand,
      model: computer.device.model,
      owner: computer.device.owner,
      updatedAt: new Date(),
      type: "frequent-computer"
    }
  }

  private mapDeviceFromComputer(computer: Computer): EnteredDevice {
    return {
      id: computer.id,
      brand: computer.brand,
      model: computer.model,
      owner: computer.owner,
      updatedAt: new Date(),
      type: "computer"
    }
  }

  private mapDeviceFromMedical(medicalDevice: MedicalDevice): EnteredDevice {
    return {
      id: medicalDevice.id,
      brand: medicalDevice.brand,
      model: medicalDevice.model,
      owner: medicalDevice.owner,
      updatedAt: new Date(),
      type: "medical-device"
    }
  }
}
