import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, Observable, throwError } from "rxjs";
import { Item } from "./item.interface";
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ItemService {
    private _baseUrl = environment.apiUrl + 'api/v1/items';

    constructor(private http: HttpClient) { }

    public getAllItems(): Observable<Item[]> {
        return this.http.get<{ success: boolean, data: Item[] }>(this._baseUrl).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    public getItemById(id: number): Observable<Item> {
        const url = `${this._baseUrl}/${id}`;
        return this.http.get<{ success: boolean, data: Item }>(url).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    public createItem(item: Item): Observable<Item> {
        return this.http.post<{ success: boolean, data: Item }>(this._baseUrl, item).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    public updateItem(id: number, item: Partial<Item>): Observable<Item> {
        const url = `${this._baseUrl}/${id}`;
        return this.http.put<{ success: boolean, data: Item }>(url, item).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    public deleteItem(id: number): Observable<void> {
        const url = `${this._baseUrl}/${id}`;
        return this.http.delete<{ success: boolean, message: string }>(url).pipe(
            map(() => { }),
            catchError(this.handleError)
        );
    }


    /** Centralized backend error parser */
    private handleError(error: HttpErrorResponse) {
        let message = 'An unexpected error occurred.';

        if (error.error) {
            // Custom backend structure: { success, message, error/details }
            if (error.error.message) {
                message = error.error.message;
            } else if (typeof error.error === 'string') {
                message = error.error;
            } else if (error.message) {
                message = error.message;
            }
        }

        console.error('API error:', error);
        return throwError(() => new Error(message));
    }
}