
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    code(id: string): Nullable<Code> | Promise<Nullable<Code>>;
    readCodeFile(codeId: string, fileId: number): Nullable<string> | Promise<Nullable<string>>;
}

export interface IMutation {
    writeCodeFile(codeId: string, fileId: number, contents: string): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export interface Template {
    id?: Nullable<string>;
    files?: Nullable<Nullable<string>[]>;
    actions?: Nullable<Nullable<string>[]>;
}

export interface Problem {
    id?: Nullable<string>;
}

export interface Session {
    id?: Nullable<string>;
}

export interface Code {
    id: string;
    template?: Nullable<Template>;
    problem?: Nullable<Problem>;
    session?: Nullable<Session>;
}

type Nullable<T> = T | null;
