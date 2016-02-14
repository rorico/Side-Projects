function varargout = CameraGUI(varargin)
% CAMERAGUI MATLAB code for CameraGUI.fig
%
% Bryan Dang Dec 2015
%
% CameraGUI is a graphical user interface to allow for the control of
% parameters of the camera such as exposure, gain, brightness, contrast,
% sharpness, gamma correction. The user can choose to use automatic exposure
% and gain or manually control these parameters. 

% This GUI also monitors the brightness level within a user selected region
% of the camera preview. The total brightness within the box is calculated
% as the sum of the luma component (Y-channel). The duration of recording
% can be specified. The number of atoms within the gas cloud can be
% correlated from this brightness level.

%
%      CAMERAGUI, by itself, creates a new CAMERAGUI or raises the existing
%      singleton*.
%
%      H = CAMERAGUI returns the handle to a new CAMERAGUI or the handle to
%      the existing singleton*.
%
%      CAMERAGUI('CALLBACK',hObject,eventData,handles,...) calls the local
%      function named CALLBACK in CAMERAGUI.M with the given input arguments.
%
%      CAMERAGUI('Property','Value',...) creates a new CAMERAGUI or raises the
%      existing singleton*.  Starting from the left, property value pairs are
%      applied to the GUI before CameraGUI_OpeningFcn gets called.  An
%      unrecognized property name or invalid value makes property application
%      stop.  All inputs are passed to CameraGUI_OpeningFcn via varargin.
%
%      *See GUI Options on GUIDE's Tools menu.  Choose "GUI allows only one
%      instance to run (singleton)".
%
% See also: GUIDE, GUIDATA, GUIHANDLES

% Edit the above text to modify the response to help CameraGUI

% Last Modified by GUIDE v2.5 21-Jan-2016 17:48:08

% Begin initialization code - DO NOT EDIT
gui_Singleton = 1;
gui_State = struct('gui_Name',       mfilename, ...
                   'gui_Singleton',  gui_Singleton, ...
                   'gui_OpeningFcn', @CameraGUI_OpeningFcn, ...
                   'gui_OutputFcn',  @CameraGUI_OutputFcn, ...
                   'gui_LayoutFcn',  [] , ...
                   'gui_Callback',   []);
if nargin && ischar(varargin{1})
    gui_State.gui_Callback = str2func(varargin{1});
end

if nargout
    [varargout{1:nargout}] = gui_mainfcn(gui_State, varargin{:});
else
    gui_mainfcn(gui_State, varargin{:});
end
% End initialization code - DO NOT EDIT

% --- Executes just before CameraGUI is made visible.
function CameraGUI_OpeningFcn(hObject, eventdata, handles, varargin)
% This function has no output args, see OutputFcn.
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
% varargin   command line arguments to CameraGUI (see VARARGIN)

% Choose default command line output for CameraGUI

% Initialize camera
handles.output = hObject;
caminfo = imaqhwinfo;
mycam = char(caminfo.InstalledAdaptors(2));
mycaminfo = imaqhwinfo(mycam);
resolution = char(mycaminfo.DeviceInfo.SupportedFormats());
vid = videoinput(mycam, 1,resolution(3,:)); % set default resoultion to full res
src = getselectedsource(vid);

% Set resolution of camera
vidRes = vid.VideoResolution;
imWidth = vidRes(1);
imHeight = vidRes(2);
nBands = vid.NumberOfBands;
hImage = image( zeros(imHeight, imWidth, nBands) );

% Preview camera on GUI
axes(handles.PreviewAxes);
preview(vid, hImage);

% Save everything in handles
handles.vid=vid;
handles.src=src;
handles.hImage=hImage;
handles.resolution=resolution;
handles.mycam=mycam;

% Populate supported resolution menu
for i = 1:size(resolution,1)/2;
supportedResolutions{4-i}=resolution(i,:);
end
set(handles.SupportedResolutions, 'String', supportedResolutions)

% Populate supported framerate menu
frameRates = set(src, 'FrameRate');
frameRates=frameRates';
set(handles.SupportedFrameRates, 'String', frameRates);

% Move Exposure slider to default position
handles.maxExposure=-2;
handles.minExposure = -13;
handles.defaultExposure=handles.src.Exposure;
exposureSlider=double(abs(handles.defaultExposure-handles.minExposure))/double(abs(handles.maxExposure-handles.minExposure));
set(handles.Exposure, 'value', exposureSlider);

% Move Brightness slider to default position
handles.maxBrightness = 30;
handles.minBrightness = -10;
handles.defaultBrightness=handles.src.Brightness;
brightnessSlider=double(abs(handles.defaultBrightness-handles.minBrightness))/double(abs(handles.maxBrightness-handles.minBrightness));
set(handles.Brightness, 'value', brightnessSlider);

% Move Gain slider to default position
handles.maxGain = 63;
handles.minGain = 16;
handles.defaultGain=handles.src.Gain;
gainSlider=double(abs(handles.defaultGain-handles.minGain))/double(abs(handles.maxGain-handles.minGain));
set(handles.Gain, 'value', gainSlider);

% Move Contrast slider to default position
handles.maxContrast = 30;
handles.minContrast = -10;
handles.defaultContrast=handles.src.Contrast;
contrastSlider=double(abs(handles.defaultContrast-handles.minContrast))/double(abs(handles.maxContrast-handles.minContrast));
set(handles.Contrast, 'value', contrastSlider);

% Move Gamma slider to default position
handles.maxGamma = 500;
handles.minGamma = 1;
handles.defaultGamma=handles.src.Gamma;
gammaSlider=double(abs(handles.defaultGamma-handles.minGamma))/double(abs(handles.maxGamma-handles.minGamma));
set(handles.Gamma, 'value', gammaSlider);

% Move Sharpness slider to default position
handles.maxSharpness = 14;
handles.minSharpness = 0;
handles.defaultSharpness=handles.src.Sharpness;
sharpnesSlider=double(abs(handles.defaultSharpness-handles.minSharpness))/double(abs(handles.maxSharpness-handles.minSharpness));
set(handles.Sharpness, 'value', sharpnesSlider);

guidata(hObject,handles);


% This sets up the initial plot - only do when we are invisible
% so window can get raised using CameraGUI.



% UIWAIT makes CameraGUI wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Outputs from this function are returned to the command line.
function varargout = CameraGUI_OutputFcn(hObject, eventdata, handles)
% varargout  cell array for returning output args (see VARARGOUT);
% hObject    handle to figure
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Get default command line output from handles structure
varargout{1} = handles.output;


% --------------------------------------------------------------------
function FileMenu_Callback(hObject, eventdata, handles)
% hObject    handle to FileMenu (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)


% --------------------------------------------------------------------
function OpenMenuItem_Callback(hObject, eventdata, handles)
% hObject    handle to OpenMenuItem (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
file = uigetfile('*.fig');
if ~isequal(file, 0)
    open(file);
end

% --------------------------------------------------------------------
function PrintMenuItem_Callback(hObject, eventdata, handles)
% hObject    handle to PrintMenuItem (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
printdlg(handles.figure1)

% --------------------------------------------------------------------
function CloseMenuItem_Callback(hObject, eventdata, handles)
% hObject    handle to CloseMenuItem (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
selection = questdlg(['Close ' get(handles.figure1,'Name') '?'],...
                     ['Close ' get(handles.figure1,'Name') '...'],...
                     'Yes','No','Yes');
if strcmp(selection,'No')
    return;
end

delete(handles.figure1)

% --- Executes on button press in SupportedResolutions.
function SupportedResolutions_Callback(hObject, eventdata, handles)
% hObject    handle to ROI (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
axes(handles.PreviewAxes);
cla;

% Change video object resolution Settings
resolution_index = get(handles.SupportedResolutions, 'Value');
vid=videoinput(handles.mycam, 1,handles.resolution(4-resolution_index,:));
vidRes = vid.VideoResolution;
imWidth = vidRes(1);
imHeight = vidRes(2);
nBands = vid.NumberOfBands;
hImage_new = image( zeros(imHeight, imWidth, nBands) );
stoppreview(vid);
axes(handles.PreviewAxes);
preview(vid, hImage_new);
handles.vid=vid;

% Display new resolution on axes
src = getselectedsource(vid);
frameRates = set(src, 'FrameRate');
frameRates=frameRates';

% Refresh preview
set(handles.SupportedFrameRates, 'String', frameRates)

handles.vid=vid;
handles.src=src;
guidata(hObject,handles);
   


% --- Executes during object creation, after setting all properties.
function SupportedResolutions_CreateFcn(hObject, eventdata, handles)
% hObject    handle to SupportedResolutions (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: popupmenu controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
     set(hObject,'BackgroundColor','white');
end


% --- Executes on selection change in SupportedFrameRates.
function SupportedFrameRates_Callback(hObject, eventdata, handles)
% hObject    handle to SupportedFrameRates (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns SupportedFrameRates contents as cell array
%        contents{get(hObject,'Value')} returns selected item from SupportedFrameRates
axes(handles.PreviewAxes);
cla;

% Change video object frame rate settings
frameRates = set(handles.src, 'FrameRate');
frameRate_index = get(handles.SupportedFrameRates, 'Value');
stoppreview(handles.vid);
handles.src.FrameRate = frameRates{frameRate_index};
vidRes = handles.vid.VideoResolution;
imWidth = vidRes(1);
imHeight = vidRes(2);
nBands = handles.vid.NumberOfBands;
hImage = image( zeros(imHeight, imWidth, nBands) );

% Refresh preview
axes(handles.PreviewAxes);
preview(handles.vid, hImage);

guidata(hObject,handles);


% --- Executes during object creation, after setting all properties.
function SupportedFrameRates_CreateFcn(hObject, eventdata, handles)
% hObject    handle to SupportedFrameRates (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: popupmenu controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on slider movement.
function Exposure_Callback(hObject, eventdata, handles)
% hObject    handle to Exposure (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider


slider_value=get(hObject,'value');
% exposureVal= round(handles.minExposure + abs(handles.maxExposure-handles.minExposure)*slider_value); % Convert slider value to normalized exposure value  
% handles.src.Exposure = exposureVal;
exposureVal= handles.minExposure + abs(handles.maxExposure-handles.minExposure)*slider_value;
set(handles.src, 'Exposure', exposureVal);
% Change exposure from auto to manual
set(handles.ExposureAuto,'value',0);
set(handles.ExposureManual,'value',1);
guidata(hObject,handles);

% --- Executes during object creation, after setting all properties.
function Exposure_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Exposure (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


% --- Executes on slider movement.
function Brightness_Callback(hObject, eventdata, handles)
% hObject    handle to Brightness (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider
slider_value=get(hObject,'value');
brightnessVal= round(handles.minBrightness + abs(handles.maxBrightness-handles.minBrightness)*slider_value); % Convert slider value
handles.src.Brightness = brightnessVal;
 guidata(hObject,handles);

% --- Executes during object creation, after setting all properties.
function Brightness_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Brightness (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end

% --- Executes on slider movement.
function Gain_Callback(hObject, eventdata, handles)
% hObject    handle to Gain (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider
slider_value=get(hObject,'value');
gainVal= round(handles.minGain + abs(handles.maxGain-handles.minGain)*slider_value); % Convert slider value
handles.src.Gain = gainVal;
% Change from auto gain to manual gain
set(handles.GainAuto,'value',0);
set(handles.GainManual,'value',1);
guidata(hObject,handles);


% --- Executes during object creation, after setting all properties.
function Gain_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Gain (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


% --- Executes on slider movement.
function Contrast_Callback(hObject, eventdata, handles)
% hObject    handle to Contrast (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of sliders
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider
slider_value=get(hObject,'value');
contrastVal= round(handles.minContrast + abs(handles.maxContrast-handles.minContrast)*slider_value); % Convert slider value
handles.src.Contrast = contrastVal;
guidata(hObject,handles);


% --- Executes during object creation, after setting all properties.
function Contrast_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Contrast (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end

% --- Executes on slider movement.
function Gamma_Callback(hObject, eventdata, handles)
% hObject    handle to Gamma (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider
slider_value=get(hObject,'value');
gammaVal= round(handles.minGamma + abs(handles.maxGamma-handles.minGamma)*slider_value); % Convert slider value
handles.src.Gamma = gammaVal;
guidata(hObject,handles);

% --- Executes during object creation, after setting all properties.
function Gamma_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Gamma (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


% --- Executes on slider movement.
function Sharpness_Callback(hObject, eventdata, handles)
% hObject    handle to Sharpness (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'Value') returns position of slider
%        get(hObject,'Min') and get(hObject,'Max') to determine range of slider
slider_value=get(hObject,'value');
sharpnessVal= round(handles.minSharpness + abs(handles.maxSharpness-handles.minSharpness)*slider_value); % Convert slider value
handles.src.Sharpness = sharpnessVal;
guidata(hObject,handles);


% --- Executes during object creation, after setting all properties.
function Sharpness_CreateFcn(hObject, eventdata, handles)
% hObject    handle to Sharpness (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: slider controls usually have a light gray background.
if isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor',[.9 .9 .9]);
end


% --- Executes on button press in ExposureManual.
function ExposureManual_Callback(hObject, eventdata, handles)
% hObject    handle to ExposureManual (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of ExposureManual
value=get(hObject, 'Value');
if value == 1 % Manual Exposure
    handles.src.ExposureMode = 'Manual';
    set(hObject, 'Value',1);
    set(handles.ExposureAuto, 'Value',0); 
else % Auto Exposure
    handles.src.ExposureMode = 'Auto';
    set(hObject, 'Value',0);
    set(handles.ExposureAuto, 'Value',1); 
    % Reset exposure to default
    exposure=handles.src.Exposure;
    exposureSlider=double(abs(exposure-handles.minExposure))/double(abs(handles.maxExposure-handles.minExposure));
    set(handles.Exposure,'value',exposureSlider); % Moves slider to default position
end
guidata(hObject,handles);


% --- Executes on button press in ExposureAuto.
function ExposureAuto_Callback(hObject, eventdata, handles)
% hObject    handle to ExposureAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of ExposureAuto
value=get(hObject, 'Value');
if value == 1 % Auto exposure
    handles.src.ExposureMode = 'Auto';
    set(hObject, 'Value',1);
    set(handles.ExposureManual, 'Value',0); 
    % Reset exposure to default
    exposure=handles.src.Exposure;
    exposureSlider=double(abs(exposure-handles.minExposure))/double(abs(handles.maxExposure-handles.minExposure));
    set(handles.Exposure,'value',exposureSlider); % Moves slider to default position
else % Manual Exposure
    handles.src.ExposureMode = 'Manual';
    set(hObject, 'Value',0);
    set(handles.ExposureManual, 'Value',1); 
end
guidata(hObject,handles);


% --- Executes on button press in GainManual.
function GainManual_Callback(hObject, eventdata, handles)
% hObject    handle to GainManual (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of GainManual
value=get(hObject, 'Value');
if value == 1 % Manual Gain
    handles.src.GainMode = 'Manual';
    set(hObject, 'Value',1);
    set(handles.GainAuto, 'Value',0); 
else % Auto Gain
    handles.src.GainMode = 'Auto';
    set(hObject, 'Value',0);
    set(handles.GainAuto, 'Value',1); 
    gain=handles.src.Gain;
    gainSlider=double(abs(gain-handles.minGain))/double(abs(handles.maxGain-handles.minGain));
    set(handles.Gain,'value',gainSlider); % Moves slider to default position
end
guidata(hObject,handles);

% --- Executes on button press in GainAuto.
function GainAuto_Callback(hObject, eventdata, handles)
% hObject    handle to GainAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of GainAuto
value=get(hObject, 'Value');
if value == 1 % Auto Gain
    handles.src.GainMode = 'Auto';
    set(hObject, 'Value',1);
    set(handles.GainManual, 'Value',0); 
    gain=handles.src.Gain;
    gainSlider=double(abs(gain-handles.minGain))/double(abs(handles.maxGain-handles.minGain));
    set(handles.Gain,'value',gainSlider); % Moves slider to default position
else % Manual Gain
    handles.src.GainMode = 'Manual';
    set(hObject, 'Value',0);
    set(handles.GainManual, 'Value',1); 
end
guidata(hObject,handles);


% --- Executes on button press in BrightnessDefault.
function BrightnessDefault_Callback(hObject, eventdata, handles)
% hObject    handle to BrightnessDefault (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
brightnessSlider=double(abs(handles.defaultBrightness-handles.minBrightness))/double(abs(handles.maxBrightness-handles.minBrightness));
set(handles.Brightness,'value',brightnessSlider); % Moves slider to default position
handles.src.Brightness=handles.defaultBrightness;
guidata(hObject,handles);

% --- Executes on button press in ContrastDefault.
function ContrastDefault_Callback(hObject, eventdata, handles)
% hObject    handle to ContrastDefault (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
contrastSlider=double(abs(handles.defaultContrast-handles.minContrast))/double(abs(handles.maxContrast-handles.minContrast));
set(handles.Contrast,'value',contrastSlider); % Moves slider to default position
handles.src.Contrast=handles.defaultContrast;
guidata(hObject,handles);

% --- Executes on button press in GammaDefault.
function GammaDefault_Callback(hObject, eventdata, handles)
% hObject    handle to GammaDefault (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
gammaSlider=double(abs(handles.defaultGamma-handles.minGamma))/double(abs(handles.maxGamma-handles.minGamma));
set(handles.Gamma,'value',gammaSlider); % Moves slider to default position
handles.src.Gamma=handles.defaultGamma;
guidata(hObject,handles);

% --- Executes on button press in SharpnesDefault.
function SharpnesDefault_Callback(hObject, eventdata, handles)
% hObject    handle to SharpnesDefault (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
sharpnessSlider=double(abs(handles.defaultSharpness-handles.minSharpness))/double(abs(handles.Sharpness-handles.minSharpness));
set(handles.Sharpness,'value',sharpnessSlider); % Moves slider to default position
handles.src.Sharpness=handles.defaultSharpness;
guidata(hObject,handles);


% --- Executes on button press in Capture.
function Capture_Callback(hObject, eventdata, handles)
% hObject    handle to Capture (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of Capture

% Checks to see if there is a box selected
if get(handles.SelectROI, 'Value')==0
    h=errordlg('Please Select Box within Camera Window Before Recording');
else
    
    % Toggle string on button
    if get(hObject, 'Value')==1
        set(hObject, 'String', 'Stop Recording');
    else
        set(hObject, 'String', 'Start Recording');
    end
    
    i=1;
    time=[];
    brightness=[];
    
    % Continues to record until specified to stop
    while get(hObject, 'Value')==1
        saturated_index=[];
        
        %Checks to see if time history has changed
        time_idx = get(handles.TimeHistory, 'Value');
        time_str = get(handles.TimeHistory, 'String');
        timeHistory_curr = str2num(cell2mat(time_str(time_idx)));
        if handles.timeHistory ~= timeHistory_curr      
            cla(handles.ReadingAxes);
            i=1;
            time=[];
            brightness=[];
            handles.timeHistory=timeHistory_curr;
        end
        
        % Pauses capture when pause button is clicked. Resumed when clicked
        % again
        while get(handles.Pause,'Value')==1
            pause(1);
            continue;
        end
        
        img=getsnapshot(handles.vid); % Capture preview image
        ROI=round(handles.ROI_flip);
        img_ROI=img(ROI(1):ROI(1)+ROI(3), ROI(2):ROI(2)+ROI(4),:); % Selects only boxed region of image
        
        % Convert from RGB to YCbCr space and uses Y channel to determine
        % brightness
        img_ROI_YCbCr = rgb2ycbcr(img_ROI);
        img_ROI_Y = img_ROI_YCbCr(:,:,1);
        saturated_index = find(img_ROI_Y == 235); % Checks if pixels are saturated
     
        % Send error message if some pixels are saturated
        if ~isempty(saturated_index) && i==1
            h=msgbox('WARNING: Some Pixels Are Saturated. Try Lowering Exposure Level', 'Error', 'error');
            waitfor(h);
%             saturationWarning=questdlg('WARNING: Some Pixels Are Saturated. Try Lowering Exposure Level', 'Pixels Saturated', 'Ignore', 'Change Exposure Level');
%             switch saturationWarning
%                 case 'Ignore'
%                     
%                 case 'Change Exposure Level'
%                     set(handles.SelectROI, 'Value',0);
%                     set(handles.SelectROI, 'String', 'Select Box');
%                     set(hObject, 'Value',0);
%                     set(hObject, 'String', 'Start Recording');
%                     delete(handles.box);
%                     break;
%             end
            % Can also make saturated pixels red, but too computationally
            % expensive
%             [m n]=ind2sub([ROI(3) ROI(4)],saturated_index);
%             x=n+ROI(2);
%             y=m+ROI(1);
%             axes(handles.PreviewAxes);
%             hold on
%             plot(x,y, 'r.', 'MarkerSize', 5);        
        end
        
        brightness_curr= sum(sum(img_ROI_Y)); % Calculate brightness
        
        % Delay between measurements based on frame rate
        time_delay = 1/(str2num(handles.src.FrameRate));
        pause(time_delay);
        
        if i==1
            time_curr=time_delay;
        else
            time_curr = time(end)+time_delay;
        end
        
        % Only keep number of data points specified by 'timeHistory'
        if time_curr > handles.timeHistory
            time = [time(2:end) time_curr];
            brightness = [brightness(2:end), brightness_curr];
        else
            time=[time time_curr];
            brightness = [brightness brightness_curr];
        end
        
        axes(handles.ReadingAxes);
        plot(time,brightness,'-');
        i=i+1;   
    end
end


% --- Executes on selection change in TimeHistory.
function TimeHistory_Callback(hObject, eventdata, handles)
% hObject    handle to TimeHistory (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns TimeHistory contents as cell array
%        contents{get(hObject,'Value')} returns selected item from TimeHistory

% Get timehistory 
time_idx = get(hObject, 'Value');
time_str = get(hObject, 'String');
handles.timeHistory = str2num(cell2mat(time_str(time_idx)));
guidata(hObject,handles);


% --- Executes during object creation, after setting all properties.
function TimeHistory_CreateFcn(hObject, eventdata, handles)
% hObject    handle to TimeHistory (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: popupmenu controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
time_idx = get(hObject, 'Value');
time_str = get(hObject, 'String');
handles.timeHistory = str2num(cell2mat(time_str(time_idx)));
guidata(hObject,handles);


% --- Executes on button press in SelectROI.
function SelectROI_Callback(hObject, eventdata, handles)
% hObject    handle to SelectROI (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of SelectROI

if get(hObject, 'Value')==1
    set(hObject, 'String', 'UnSelect Box');
    % Promt user to draw a rectange
    ROI = getrect;
    
    % Need to flip ROI because dimensions of image is flipped
    ROI_flip = ones(1,4);
    ROI_flip(1) = ROI(2);
    ROI_flip(2) = ROI(1);
    ROI_flip(3) = ROI(4);
    ROI_flip(4) = ROI(3);
    handles.ROI_flip=ROI_flip;
    handles.ROI=ROI;
    
    % Display drawn rectange
    axes(handles.PreviewAxes);
    handles.box=rectangle('Position',handles.ROI, 'EdgeColor', 'r', 'Linewidth', 2);
    
    % Checks to see if drawn rectange is within camera preview window
    resolution_index = get(handles.SupportedResolutions, 'Value');
    resolution = handles.resolution(4-resolution_index,:);
    width=744;%str2num(resolution(7:9));
    height=480;%str2num(resolution(11:13));
    resolution
    ROI_flip
    height
    width
    if round(ROI_flip(1) + ROI_flip(3)) > height || round(ROI_flip(2) + ROI_flip(4)) > width
        h=errordlg('Please Reselect Box Within Camera Streaming Window');
    end
else 
    % Delete box/ROI object to allow for user to reselect another
    set(hObject, 'String', 'Select Box');
    delete(handles.box);
    handles.ROI=[];
    handles.ROI_flip=[];
    set(handles.Capture, 'Value', 0);
    set(handles.Capture, 'String', 'Start Recording')
end
guidata(hObject,handles);


% --- Executes on button press in Pause.
function Pause_Callback(hObject, eventdata, handles)
% hObject    handle to Pause (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hint: get(hObject,'Value') returns toggle state of Pause
if get(hObject, 'Value')==1
    set(hObject, 'String', 'Resume Recording');
else
    set(hObject, 'String', 'Pause Recording');
end
