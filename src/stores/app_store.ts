import { AVSearchResult } from './../types';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { search } from '../api';
import { log } from '../utils';

export class AppStore {
    public pending: boolean = false;
    public error: string = '';
    public searchResults: AVSearchResult[] = [];

    constructor() {
        makeObservable(this, {
            pending: observable,
            error: observable,
            searchResults: observable,
            search: action,
        });
    }

    public async search(term: string): Promise<void> {
        this.error = '';
        this.pending = true;

        try {
            const results = await search(term);
            runInAction(() => {
                this.searchResults = results;
                this.pending = false;
            });
        } catch (error) {
            log.error(`Error searching for ${term}`, error);
            runInAction(() => {
                this.searchResults = [];
                this.error = 'Error doing search';
                this.pending = false;
            });
        }
    }
}
