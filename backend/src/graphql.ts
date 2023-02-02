
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Directory {
    name: string;
    path: string;
    directories?: Nullable<Nullable<Directory>[]>;
    files?: Nullable<Nullable<File>[]>;
}

export interface File {
    name?: Nullable<string>;
    path?: Nullable<string>;
    contents?: Nullable<string>;
    size?: Nullable<number>;
    modifyTime?: Nullable<Date>;
}

export interface IQuery {
    readFile(path: string): Nullable<string> | Promise<Nullable<string>>;
    files(dir?: Nullable<string>): Nullable<Nullable<File>[]> | Promise<Nullable<Nullable<File>[]>>;
}

export interface IMutation {
    writeFile(path: string, contents: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

type Nullable<T> = T | null;
