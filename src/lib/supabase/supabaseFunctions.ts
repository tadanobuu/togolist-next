import { supabase } from './supabase'

type newTogoType = {
    palceName: string,
    address: string,
    prefecture: string,
    lat: number,
    lng: number,
    startDate: Date,
    endDate: Date,
    imageUrl: string,
    postDatetime: Date,
    postUserId: string
}

export const getAllTogos = async () => {
    const togos = await supabase.from("togo").select("");
    return togos;
};

export const addTogo = async (newTogo: newTogoType) => {
    await supabase.from("togo").insert(newTogo)
}