import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import location from '@iconify/icons-ic/location-on';
import { alpha } from '@material-ui/core/styles';
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
// material
import { Tooltip, Stack, Button, TextField, DialogTitle, DialogActions, DialogContent, Autocomplete } from '@material-ui/core';
// components
import { MIconButton } from '../../components/@material-extend';
import { DialogAnimate } from '../../components/animate';
// actions
import { setDeliveryLocation } from '../../redux/actions/app';


// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const {t} = useTranslation();
  const anchorRef = useRef(null);
  const currentLocation = useSelector((state)=>state.app.deliveryLocation);
  const [open, setOpen] = useState(!currentLocation);
  
  const [deliveryLocation, setLocation] = useState('');
  
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const {
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: process.env.REACT_APP_GOOGLE_PLACE_API_KEY,
     options: {
      componentRestrictions: { country: "cm" },
      types: ["(cities)"],
    }
  });
  const handleSubmitDeliveryLocation = ()=>{
      dispatch(setDeliveryLocation(deliveryLocation));
      handleClose();
  }

  return (
    <>
    <Tooltip title={currentLocation}>
    <MIconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
            ...(open && {
                bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
              })
        }}
      >
        <Icon icon={location} width={22} height={22} />
        {/* <Typography variant='subtitle2' maxWidth={100} noWrap>{currentLocation}</Typography> */}
      </MIconButton>
      
    </Tooltip>
      

      <DialogAnimate onClose={currentLocation && handleClose} open={open}>
          <DialogTitle>{t('navbar.locationPopupTitle')}</DialogTitle>
          <DialogContent>
              <Stack sx={{ my: 2}}>
                <Autocomplete
                freeSolo
                autoComplete
                fullWidth
                loading={isPlacePredictionsLoading}
                options={placePredictions}
                getOptionLabel={(option)=>option.description}
                onSelect={(e)=>{
                        setLocation(e.target.value)  
                }}
                autoSelect
                renderInput={(params)=> <TextField
                {...params}
                label={currentLocation || 'Find your location'}
                onChange={(evt) => {
                        getPlacePredictions({ input: evt.target.value })
                }}
                />}
                />
              </Stack>
          </DialogContent>
          <DialogActions>
            <Button type="button" color="primary" variant="contained" disabled={!deliveryLocation || placePredictions.find((item)=>item.description === deliveryLocation) === undefined} onClick={handleSubmitDeliveryLocation}>
              {t('actions.confirm')}
            </Button>
          </DialogActions>
      </DialogAnimate>
    </>
  );
}
