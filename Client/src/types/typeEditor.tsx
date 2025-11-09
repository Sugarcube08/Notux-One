export type Block = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    z: number;
};

export type RawBlockPosition = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zIndex?: number;
};

export type RawBlock = {
    id?: string;
    _id?: string;
    position?: RawBlockPosition | null;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    z?: number;
    content?: string | null;
};

export type BlocksEnvelope = {
    blocks?: RawBlock[];
    data?: RawBlock[];
    block?: RawBlock;
};

export type ApiResponseLike = BlocksEnvelope | RawBlock | RawBlock[] | null | undefined;
