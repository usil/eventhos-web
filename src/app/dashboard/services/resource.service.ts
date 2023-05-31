import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})

export class ResourceService {
    httpRoute = environment.api + '/auth/resource';

    constructor(private http: HttpClient) { }

    getResourcesBasic(): Observable<OptionResult> {
        return this.http
            .get<OptionResult>(this.httpRoute + `?basic=true`)
            .pipe(first());
    }

    getResources(
        pageIndex: number,
        order: string
    ): Observable<ResourcePaginationResult> {
        return this.http
            .get<ResourcePaginationResult>(
                this.httpRoute +
                `?pageIndex=${pageIndex}&&itemsPerPage=20&&order=${order}`
            )
            .pipe(first());
    }

    createResource(resourceIdentifier: string, applications_id: number) {
        return this.http.post(this.httpRoute, {
            resourceIdentifier,
            applications_id,
        });
    }

    updateResourceOptions(
        resourceId: number,
        newResourceOptions: Option[],
        originalResourceOptions: Option[]
    ) {
        return this.http
            .put(this.httpRoute + `/${resourceId}/permission`, {
                newResourcePermissions: newResourceOptions,
                originalResourcePermissions: originalResourceOptions,
            })
            .pipe(first());
    }

    deleteResource(resourceId: number) {
        return this.http.delete(this.httpRoute + `/${resourceId}`);
    }
}

interface ResourcePaginationResult {
    message: string;
    code: number;
    content?: ResourcePaginationContent;
}

interface OptionResult {
    message: string;
    code: number;
    content?: Resource[];
}
export interface Option {
    allowed: string;
    id: number;
}
export interface Resource {
    id: number;
    applicationResourceName: string;
    allowed: Option[];
}

interface ResourcePaginationContent {
    items: Resource[];
    pageIndex: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}