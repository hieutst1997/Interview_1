import React, { useState } from 'react';
import styles from './Campaign.module.css';
import {
    addCampaign,
    getCampagin
} from './campaignSlice';
import { useAppDispatch } from '../../app/hooks';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import VNASettings from '../../settings/VNLL/index';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import helper from 'untils/helper';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';


const Campaign = () => {

    const [value, setValue] = useState('1');
    const [firstTimeRender, setFirstTimeRender] = useState(true);
    const [dataSubmit, setDataSubmit] = useState(getCampagin);
    const [choosenSubCampaignIdx, setChoosenSubCampaignIdx] = useState(0);
    const [checkedAds, setCheckedAds] = useState<any>([]);
    const [checkedAllUi, setCheckedAllUi] = useState(false);
    const [listEmptyField, setListEmptyField] = useState<any>([]);
    const dispatch = useAppDispatch();
    

    const handleChangeTable = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };





    const checkEmptyFieldsAndShowIndex = (obj: any) => {
        const emptyFieldsIndex: any = [];
        if(!obj?.information?.name ){
            return true;
        }

        obj.subCampaigns.forEach((subCampaign: any, index: any) => {
            if (!subCampaign.name || subCampaign.ads.length === 0) {
                emptyFieldsIndex.push(index);
            }
            
            const emptyAdsIndex = subCampaign.ads.findIndex((ad: any) => !ad.name || !ad.quantity);
            if (emptyAdsIndex !== -1) {
                emptyFieldsIndex.push(index);
            }
        });

        if (emptyFieldsIndex.length > 0) {
            setListEmptyField(emptyFieldsIndex)
            return true;
            
        } else {
            setListEmptyField([])
            return false
        }
    };



    const submitCampaign = () => {
        setFirstTimeRender(false);
        const isEmpty = checkEmptyFieldsAndShowIndex(dataSubmit);

        if (isEmpty) {
            alert('Vui lòng nhập đầy đủ thông tin')
        } else {
            dispatch(addCampaign(dataSubmit))
            alert(JSON.stringify(dataSubmit));
        }
    }

    const addSubCampaigns = () => {
        let newValue = {
            name: `Chiến dịch con ${ dataSubmit.subCampaigns.length + 1}`,
            status: true,
            ads: [{
                name: 'Quảng cáo 1',
                quantity: 1
            }]
        }

        setDataSubmit(prevObject => ({
            ...prevObject,
            subCampaigns: [...prevObject.subCampaigns, newValue]
        }));

    }

    const addActiveClass = (event: any, index: number) => {
        const subCampaignBox = document.querySelectorAll('.subCampaignItem');
        if(subCampaignBox){
            for(let i = 0; i <subCampaignBox.length; i++){
                subCampaignBox[i].classList.remove('active');
            }        
        }    
        event?.target?.classList.add('active');
        setChoosenSubCampaignIdx(index)

    }

    const handleChangeSubCampaign = (event: any, choosenIdx: number, action: string) => {
        switch (action){
            case 'CHANGE_NAME' : {
                const updateItems = dataSubmit.subCampaigns.map((item: any, index: any) => 
                    index === choosenIdx ? {...item, name: event?.target?.value} : item
                );

                setDataSubmit(prevObject => ({
                    ...prevObject,
                    subCampaigns: updateItems
                }));
                break;
            }

            case 'CHANGE_STATUS' : {
                const updateItems = dataSubmit.subCampaigns.map((item: any, index: any) => 
                    index === choosenIdx ? {...item, status: !item.status} : item
                );

                setDataSubmit(prevObject => ({
                    ...prevObject,
                    subCampaigns: updateItems
                }));

                break;
            }


            case 'ADD_ADS': {

                let newValue = {
                    name: `Quảng cáo ${dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.length + 1}`,
                    quantity: 1
                }

                const updateData = dataSubmit.subCampaigns.map((item, index) => 
                   index === choosenIdx ? {...item, ads: [...item.ads, newValue]} : item
                )


                setDataSubmit(prevObject => ({
                    ...prevObject,
                    subCampaigns: updateData    
                }));
                break;
            }

            case 'CHANGE_QUANTITY_ADS' : {

                let num = parseInt(event?.target?.value);
                if(!num) {
                    return
                }

                setDataSubmit((prevObject) => {
                    const updatedSubCampaigns = [...prevObject.subCampaigns];
                    updatedSubCampaigns[choosenSubCampaignIdx] = {
                    ...updatedSubCampaigns[choosenSubCampaignIdx],
                    ads: updatedSubCampaigns[choosenSubCampaignIdx].ads.map((ad: any, index: any) => {
                        if (index === choosenIdx) {
                                return { ...ad, quantity: num };
                            }
                            return ad;
                        })
                    }

                    return { ...prevObject, subCampaigns: updatedSubCampaigns };
                });


                break;
            }

            case 'CHANGE_NAME_ADS' : {
                setDataSubmit((prevObject) => {
                    const updatedSubCampaigns = [...prevObject.subCampaigns];
                    updatedSubCampaigns[choosenSubCampaignIdx] = {
                    ...updatedSubCampaigns[choosenSubCampaignIdx],
                    ads: updatedSubCampaigns[choosenSubCampaignIdx].ads.map((ad: any, index: any) => {
                        if (index === choosenIdx) {
                                return { ...ad, name: event?.target?.value };
                            }
                            return ad;
                        })
                    }

                    return { ...prevObject, subCampaigns: updatedSubCampaigns };
                });


                break;
            }

            case 'DELETE_ADS' : {
                setDataSubmit((prevObject) => {
                    const updatedSubCampaigns = [...prevObject.subCampaigns];
                    updatedSubCampaigns[choosenSubCampaignIdx] = {
                    ...updatedSubCampaigns[choosenSubCampaignIdx],
                        ads: updatedSubCampaigns[choosenSubCampaignIdx].ads.filter((ad: any, index: any) => index !== choosenIdx)
                    }

                    return { ...prevObject, subCampaigns: updatedSubCampaigns };
                });
                break;
            }

            case 'DELETE_ALL_ADS': {
                const updateData = dataSubmit.subCampaigns.map((item, index) => 
                   index === choosenIdx ? {...item, ads: []} : item
                )

                setDataSubmit(prevObject => ({
                    ...prevObject,
                    subCampaigns: updateData    
                }));

                setCheckedAds([]);
                setCheckedAllUi(false);
                break;
            }

            default : {
                break;
            }
        }

        

    }

    const tabFuncOne = () => {

        return (
            <Box
                sx={{
                '& .MuiTextField-root': { width: '100%' },
                }}>
                    <div>
                        <TextField
                            label= {VNASettings.CAMPAIGN.textField.tabOne.fieldOne}
                            value={dataSubmit.information.name}
                            variant="standard"
                            required
                            error={helper.checkValidation(dataSubmit.information.name) && !firstTimeRender}
                            helperText={helper.checkValidation(dataSubmit.information.name) && !firstTimeRender ? "Dữ liệu không hợp lệ" : ""}
                            onChange={(event) => setDataSubmit({
                                ...dataSubmit,
                                information: {
                                    name:  event?.target?.value,
                                    describe: dataSubmit.information.describe
                                },
                            })}
                    />
                    </div>

                    <div style={{marginTop: '15px'}}>
                        <TextField
                            label= {VNASettings.CAMPAIGN.textField.tabOne.fieldTwo}
                            value={dataSubmit.information.describe}
                            variant="standard"
                            onChange={(event) => setDataSubmit({
                                ...dataSubmit,
                                information: {
                                    name:  dataSubmit.information.name,
                                    describe: event?.target?.value
                                },
                            })}
                    />
                    </div>
                    
            </Box>
        )
    }


    const tabFuncTwo = () => {
        const handleChange1 = (isChecked: any, listIdx: any) => {
            if (isChecked){
                setCheckedAllUi(true)
                setCheckedAds(listIdx)
            }else {
                setCheckedAllUi(false)
                setCheckedAds([])
            };
        };

        const handleChange2 = (isChecked: any, idx: any) => {

            if (isChecked) {
                return setCheckedAds((state: any) => [...state, idx])
            }else{
                const newData = checkedAds.filter((item: any) => item !== idx)
                setCheckedAds(newData);
            }
            
        };
        

        return (
            <div>
                <div style={{width: '100%', overflow: 'auto'}}>
                    <div className={styles.campaignFlexBox}>

                        <IconButton 
                            aria-label="add" 
                            onClick={addSubCampaigns}
                            sx = {{width: '48px', height: '48px', borderRadius: '100%', backgroundColor: 'rgb(237, 237, 237)'}}>
                            <AddIcon sx = {{color: 'red'}} />
                        </IconButton>


                        <div className={styles.campaignFlexBox}>
                            {dataSubmit.subCampaigns.map((item:any, index: any) => {
                                const totalQuantity = item?.ads?.reduce((accumulator: any, qta: any) => accumulator + (qta?.quantity || 0), 0);
                                return (
                                    <Card 
                                        key={index} 
                                        sx={{ width: 213, boxShadow: 1, margin: '5px', marginRight: 2, cursor: 'pointer' }}
                                        className= {index === 0 ? 'subCampaignItem active' : 'subCampaignItem'}
                                        onClick = {(event) => addActiveClass(event, index)}>
                                        <CardContent sx = {{display: 'flex', flexDirection: 'column', alignItems:'center', padding: '8px'}}>
                                            <Typography 
                                                variant="h6" 
                                                component="div"
                                                style={listEmptyField[index] === index || !dataSubmit.information.name ? {color: 'red'} : {color: 'inherit'}}>
                                                {item?.name} 

                                                <CheckCircleIcon style={item.status ? {color: 'green', fontSize: '14px', marginLeft: '3px'} : {color: 'rgb(141, 141, 141)', fontSize: '14px', marginLeft: '3px'}} />
                                            </Typography>
                                            
                                            <Tooltip title="Số lượng" arrow placement="left">
                                                <Typography
                                                    variant="h5" 
                                                    sx = {{marginTop: '10px', display: 'block', width: '100%', textAlign: 'center'}}>
                                                    {totalQuantity}
                                                </Typography>
                                            </Tooltip>
                                                    
                                        </CardContent>
                                    </Card>
                                )
                            })}

                        </div>
                    </div>
                </div>
                

                <div style={{marginTop: '24px'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <div style={{width: '65%'}}>
                            <TextField
                                label= 'Tên chiến dịch con'
                                variant="standard"
                                required
                                value={dataSubmit.subCampaigns[choosenSubCampaignIdx].name}
                                error={helper.checkValidation(dataSubmit.subCampaigns[choosenSubCampaignIdx].name) && !firstTimeRender}
                                helperText={helper.checkValidation(dataSubmit.subCampaigns[choosenSubCampaignIdx].name) && !firstTimeRender ? "Dữ liệu không hợp lệ" : ""}
                                sx = {{width: '100%'}}
                                onChange={(event) => handleChangeSubCampaign(event, choosenSubCampaignIdx, 'CHANGE_NAME')}/>
                        </div>

                        <div style={{width: '35%', display: 'flex', justifyContent: 'center'}}>
                            <FormControlLabel
                                label='Đang hoạt động'
                                control={
                                <Checkbox
                                    checked={dataSubmit.subCampaigns[choosenSubCampaignIdx].status}
                                    onChange={(event) => handleChangeSubCampaign(event, choosenSubCampaignIdx, 'CHANGE_STATUS')}
                                />
                                }
                            />
                        </div>
                    </div>
                    
                </div>

                <div style={{marginTop: '24px'}}>
                    <Box sx={{ width: '100%' }}>
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                disabled = {dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.length === 0 ? true : false}
                                                checked={checkedAds.length === dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.length && checkedAds.length > 0}
                                                indeterminate={
                                                    checkedAds.length !== dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.length &&
                                                    checkedAds.length > 0
                                                }
                                                onChange={(event) => handleChange1(event.target.checked, 
                                                dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.map((item, index) => index))}/>
                                        </TableCell>

                                        <TableCell 
                                            colSpan={2}
                                            style={checkedAllUi ? {display: 'table-cell'} : {display: 'none'}}>
                                            <IconButton aria-label="delete" onClick={(event) => handleChangeSubCampaign(event, choosenSubCampaignIdx, 'DELETE_ALL_ADS' )}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>


                                        <TableCell
                                            component="th"
                                            scope="row"
                                            padding="normal"
                                            style={!checkedAllUi ? {display: 'table-cell', paddingBottom: '10px'} : {display: 'none'}}>
                                            <p style={{fontSize: '16px'}}>Tên quảng cáo*</p>
                                        </TableCell>

                                        <TableCell
                                            component="th"
                                            scope="row"
                                            padding="normal"
                                            style={!checkedAllUi ? {display: 'table-cell', paddingBottom: '10px'} : {display: 'none'}}>
                                            <p style={{fontSize: '16px'}}>Số lượng*</p>
                                        </TableCell>

                                        <TableCell
                                            component="th"
                                            scope="row"
                                            padding="normal"
                                            style={{paddingBottom: '10px',}}>
                                                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                                    <Button 
                                                        variant="outlined" 
                                                        startIcon={<AddIcon />}
                                                        onClick={(event) => handleChangeSubCampaign(event, choosenSubCampaignIdx, 'ADD_ADS' )}>
                                                        Thêm
                                                    </Button>
                                                </div>
                                            
                                        </TableCell>
                                    </TableRow>
                                    
                                </TableHead>
                                    

                                <TableBody>
                                    {dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.map((row, index) => {
                                        return (
                                            <TableRow
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={index}
                                                hover
                                                sx={{ cursor: 'pointer' }}
                                                style={checkedAds.includes(index) || checkedAds.length === dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.length ? {backgroundColor: 'rgba(245, 0, 87, 0.08)'} : {}}>
                                                    <TableCell padding="checkbox">
                                                        
                                                        <Checkbox
                                                            checked={checkedAds.includes(index) || checkedAds.length === dataSubmit.subCampaigns[choosenSubCampaignIdx].ads.length}
                                                            onChange={(event) =>
                                                                handleChange2(event.target.checked, index)
                                                            }
                                                            inputProps={{ "aria-label": "controlled" }}
                                                            />
                                                            
                                                    </TableCell>

                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        padding="normal">
                                                            <TextField
                                                                variant="standard"
                                                                required
                                                                value={row.name}
                                                                error={helper.checkValidation(row.name) && !firstTimeRender}
                                                                helperText={helper.checkValidation(row.name) && !firstTimeRender ? "Dữ liệu không hợp lệ" : ""}
                                                                sx = {{width: '100%'}}
                                                                onChange={(event) => handleChangeSubCampaign(event, index, 'CHANGE_NAME_ADS' )}
                                                               />
                                                    </TableCell>

                                                    <TableCell
                                                        component="th"
                                                        scope="row"
                                                        padding="normal">
                                                        <TextField
                                                            variant="standard"
                                                            required
                                                            value={row.quantity}
                                                            error={helper.checkValidation(row.quantity) && !firstTimeRender}
                                                            helperText={helper.checkValidation(row.quantity) && !firstTimeRender ? "Dữ liệu không hợp lệ" : ""}
                                                            InputProps={{
                                                                inputProps: {
                                                                    type: 'number',
                                                                    min: 1, 
                                                                },
                                                            }}
                                                            sx = {{width: '100%'}}
                                                            onChange={(event) => handleChangeSubCampaign(event, index, 'CHANGE_QUANTITY_ADS' )}
                                                        />
                               
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <IconButton aria-label="delete" onClick={(event) => handleChangeSubCampaign(event, index, 'DELETE_ADS' )}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </div>
            </div>
        )
    }


    return (

        <Box component="form" sx = {{overflow: 'hidden',}}>
            <div style={{
                borderBottom: '1px solid', 
                padding: '15px 0px 10px 10px',
                marginBottom: '20px' }}>
                <div style={{
                    width: '95%', 
                    margin: 'auto',
                    display: 'flex',
                    justifyContent: 'flex-end'}}>
                    <Button variant='contained' onClick={submitCampaign}>Submit</Button>
                </div>
            </div>

            <Box sx={{ width: '95%', margin: 'auto', marginBottom: '15px', boxShadow: 1, borderRadius: '6px'}}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChangeTable} aria-label="lab API tabs example">
                            <Tab label= {VNASettings.CAMPAIGN.titleTab.tabOne} value="1" />
                            <Tab label= {VNASettings.CAMPAIGN.titleTab.tabTwo} value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        {tabFuncOne()}
                    </TabPanel>
                    <TabPanel value="2">
                        {tabFuncTwo()}
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>

       
    )
}

export default Campaign;