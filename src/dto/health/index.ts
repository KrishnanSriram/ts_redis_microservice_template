export interface IServiceStatus {
    serviceName: string;
    status: boolean;
}

export interface IHealthDTO {
    serviceName: string;
    getHealth(): boolean;
    toJSON(): IServiceStatus;
}

export abstract class HealthDTO implements IHealthDTO {
    abstract serviceName: string;
    abstract getHealth(): boolean;

    toJSON(): IServiceStatus {
        return { serviceName: this.serviceName, status: this.getHealth() };
    }
}