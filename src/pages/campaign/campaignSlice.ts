import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface CampaignState {
    information: {
        name: string
        describe?: string
    },
    subCampaigns: [{
        name: string
        status: boolean
        ads: [{
            name: string
            quantity: number
        }]
    }]
}


const initialState = {
    information: {
        name: "",
        describe: ""
    },

    subCampaigns: [{
        name: 'Chiến dịch con 1',
        status: true,
        ads: [
            {
                name: 'Quảng cáo 1',
                quantity: 1
            },

        ]
    }]
    
};


export const campaignSlice = createSlice({
    name: 'campaign',
    initialState,
    reducers: {
        addCampaign: (state, action: PayloadAction<any>) => {
            
            state = action.payload
            console.log(state)
        }
    }
}) 

export const { addCampaign } = campaignSlice.actions;
export const getCampagin = initialState;
export default campaignSlice.reducer;


