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

% Last Modified by GUIDE v2.5 06-Mar-2016 18:12:27

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
mycam = char(caminfo.InstalledAdaptors(1));
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
handles.imWidth=imWidth;
handles.imHeight=imHeight;
handles.mycam=mycam;

%TESTESTSETSET
handles.calibrate = [];
handles.calibrateDisplay = [];
handles.readingXval = [];
handles.readingYval = [];
handles.cursorAuto = true;
handles.cursorX = true;
%TESTESTSETEST

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
ExposureInfo = propinfo(src,'Exposure');
ExposureRange = ExposureInfo.ConstraintValue();
handles.minExposure = ExposureRange(1);
handles.maxExposure = ExposureRange(2);
handles.defaultExposure=handles.src.Exposure;
exposureSlider=double(abs(handles.defaultExposure-handles.minExposure))/double(abs(handles.maxExposure-handles.minExposure));
set(handles.Exposure, 'value', exposureSlider);

% Move Brightness slider to default position
BrightnessInfo = propinfo(src,'Brightness');
BrightnessRange = BrightnessInfo.ConstraintValue();
handles.minBrightness = BrightnessRange(1);
handles.maxBrightness = BrightnessRange(2);
handles.defaultBrightness=handles.src.Brightness;
brightnessSlider=double(abs(handles.defaultBrightness-handles.minBrightness))/double(abs(handles.maxBrightness-handles.minBrightness));
set(handles.Brightness, 'value', brightnessSlider);

% Move Gain slider to default position
GainInfo = propinfo(src,'Gain');
GainRange = GainInfo.ConstraintValue();
handles.minGain = GainRange(1);
handles.maxGain = GainRange(2);
handles.defaultGain=handles.src.Gain;
gainSlider=double(abs(handles.defaultGain-handles.minGain))/double(abs(handles.maxGain-handles.minGain));
set(handles.Gain, 'value', gainSlider);

% Move Contrast slider to default position
ContrastInfo = propinfo(src,'Contrast');
ContrastRange = ContrastInfo.ConstraintValue();
handles.minContrast = ContrastRange(1);
handles.maxContrast = ContrastRange(2);
handles.defaultContrast=handles.src.Contrast;
contrastSlider=double(abs(handles.defaultContrast-handles.minContrast))/double(abs(handles.maxContrast-handles.minContrast));
set(handles.Contrast, 'value', contrastSlider);

% Move Gamma slider to default position
GammaInfo = propinfo(src,'Gamma');
GammaRange = GammaInfo.ConstraintValue();
handles.minGamma = GammaRange(1);
handles.maxGamma = GammaRange(2);
handles.defaultGamma=handles.src.Gamma;
gammaSlider=double(abs(handles.defaultGamma-handles.minGamma))/double(abs(handles.maxGamma-handles.minGamma));
set(handles.Gamma, 'value', gammaSlider);

% Move Sharpness slider to default position
SharpnessInfo = propinfo(src,'Sharpness');
SharpnessRange = SharpnessInfo.ConstraintValue();
handles.minSharpness = SharpnessRange(1);
handles.maxSharpness = SharpnessRange(2);
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
handles.imWidth=imWidth;
handles.imHeight=imHeight;

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


% --- Executes when selected object is changed in ExposureAuto.
function ExposureAutomatic_SelectionChangedFcn(hObject, eventdata, handles)
% hObject    handle to the selected object in ExposureAuto 
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

value = get(eventdata.NewValue, 'tag');
if strcmp(value,'ExposureManual')
    handles.src.ExposureAuto = 'Off';
else % Auto Exposure
    handles.src.ExposureAuto = 'On';
    % Reset exposure to default
    exposure=handles.src.Exposure;
    exposureSlider=double(abs(exposure-handles.minExposure))/double(abs(handles.maxExposure-handles.minExposure));
    set(handles.Exposure,'value',exposureSlider); % Moves slider to default position
end
guidata(hObject,handles);

% --- Executes when selected object is changed in GainAutomatic.
function GainAutomatic_SelectionChangedFcn(hObject, eventdata, handles)
% hObject    handle to the selected object in GainAutomatic 
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

value = get(eventdata.NewValue, 'tag');
if strcmp(value,'GainManual')
    handles.src.GainAuto = 'Off';
else % Auto Exposure
    handles.src.GainAuto = 'On';
    % Reset exposure to default
    gain=handles.src.Gain;
    gainSlider=double(abs(gain-handles.minGain))/double(abs(handles.maxGain-handles.minGain));
    set(handles.Gain,'value',gainSlider); % Moves slider to default position
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

% --- Executes on button press in SharpnessDefault.
function SharpnessDefault_Callback(hObject, eventdata, handles)
% hObject    handle to SharpnessDefault (see GCBO)
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
    
    time_curr = 0;
    past=[];
    axes(handles.ReadingAxes);
    
    % Continues to record until specified to stop
    while get(hObject, 'Value')==1
        
        % Pauses capture when pause button is clicked. Resumed when clicked
        % again
        while get(handles.Pause,'Value')==1
            datacursormode on;
            pause(1);
            continue;
        end
        datacursormode off;
        
        
        img=getsnapshot(handles.vid); % Capture preview image
        ROI=round(handles.ROI_flip);
        img_ROI=img(ROI(1):ROI(1)+ROI(3), ROI(2):ROI(2)+ROI(4),:); % Selects only boxed region of image
        
        % Convert from RGB to YCbCr space and uses Y channel to determine
        % brightness
        img_ROI_YCbCr = rgb2ycbcr(img_ROI);
        img_ROI_Y = img_ROI_YCbCr(:,:,1);
        
        %Checks to see if time history has changed
        time_idx = get(handles.TimeHistory, 'Value');
        time_str = get(handles.TimeHistory, 'String');
        timeHistory_curr = str2num(cell2mat(time_str(time_idx)));
        if handles.timeHistory ~= timeHistory_curr
            handles.timeHistory = timeHistory_curr;
        end
        
        
        % Delay between measurements based on frame rate
        time_delay = 1/(str2num(handles.src.FrameRate));
        time_curr = time_curr + time_delay;
        
        % Only keep number of data points specified by 'timeHistory
        
        if time_curr > handles.timeHistory
            index = ceil((time_curr - handles.timeHistory)/time_delay);
            index = min(index,size(past,1));
            past = past(index + 1:end,:);
            time_curr = time_curr - time_delay * index;
        else
        end
        past = [past;mean(img_ROI_Y,1)];
        
        xvals = ROI(2):(ROI(2)+ROI(4));
        calibration = handles.calibrate;
        if size(calibration,2) >= 2
            x1 = calibration(:,1);
            x2 = calibration(:,2);
            m = (x1(1)-x2(1))/(x1(2)-x2(2));
            b = x1(1) - m * x1(2);
            xvals = xvals * m + x0;
        elseif size(calibration,2) == 1
            x1 = calibration(:,1);
            m = 0.2*x1(1)/size(img,2); %0.2 picked arbitrarily
            b = x1(1) - m * x1(2);
        else
            m = 1;
            b = 0;
        end
        xvals = xvals * m + b;
            
        yvals = mean(past,1);
        handles.readingXval = yvals;
        handles.readingXval = xvals;
        guidata(hObject,handles);
        if handles.cursorAuto
            [maxLine, index] = max(yvals);
            set(handles.readingY,'String',maxLine);
            set(handles.readingX,'String',xvals(index));
        else
            x = handles.cursorX;
            i = 1 + (x - xvals(1)) / m;
            y2 = yvals(ceil(i));
            y1 = yvals(floor(i));
            m = y2 - y1;
            y = y1 + (i - floor(i)) * m;
            set(handles.readingY,'String',y);
        end
        plot(xvals,yvals,'-');
        ylabel('average hits');
        xlabel('wavelength (m)');
        pause(time_delay);
    end
    datacursormode on % show cursors after stop recording
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
set(hObject, 'Value', 2);   % default 1 sec
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
    handles.selectBox=rectangle('Position',handles.ROI, 'EdgeColor', 'r', 'Linewidth', 2);
    
    % Checks to see if drawn rectange is within camera preview window
    width=handles.imWidth;
    height=handles.imHeight;
    if round(ROI_flip(1) + ROI_flip(3)) > height || round(ROI_flip(2) + ROI_flip(4)) > width
        h=errordlg('Please Reselect Box Within Camera Streaming Window');
    end
else 
    % Delete box/ROI object to allow for user to reselect another
    set(hObject, 'String', 'Select Box');
    delete(handles.selectBox);
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


% --- Executes on button press in Calibrate.
function Calibrate_Callback(hObject, eventdata, handles)
% hObject    handle to Calibrate (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
wavelengthInputs = inputdlg('Enter Wavelength','Calibration Wavelength',1,{'500nm'});
wavelengthStr = wavelengthInputs{1};
if isempty(wavelengthStr)
    h=errordlg('Enter Wavelength');
else
    if wavelengthStr(end) ~= 'm'
        h=errordlg('Enter Wavelength in terms of meters (m)');
    else
        prefix = wavelengthStr(end-1);
        unitIndex = size(wavelengthStr,2) - 1;
        multiplier = 1;
        if prefix == 'm'
            multiplier = 1e-3;
        elseif prefix == 'u'
            multiplier = 1e-6;
        elseif prefix == 'n'
            multiplier = 1e-9;
        elseif prefix == 'p'
            multiplier = 1e-12;
        elseif prefix == 'f'
            multiplier = 1e-15;
        else 
            [num, status] = str2num(prefix)
            if status
                unitIndex = size(wavelengthStr,2);
            else
                h=errordlg('Cannot understand units');
            end
        end
        [wavelength, status] = str2num(wavelengthStr(1:unitIndex-1));
        wavelength = wavelength * multiplier;
        if status ~= 1
            h=errordlg('Cannot understand digits');
        else
            %the wavelength is processed and turned into a number
            img = getsnapshot(handles.vid);
            img_Y = rgb2ycbcr(img);
            img_Y = img_Y(:,:,1);
            [maxLine, index] = max(sum(img_Y));
            
            
            % Display line used
            axes(handles.PreviewAxes);
            handles.calibrateDisplay = [handles.calibrateDisplay rectangle('Position',[index,1,1,size(img_Y,2)], 'EdgeColor', 'r', 'Linewidth', 2)];
            handles.calibrate = [handles.calibrate [wavelength index]'];
            handles.calibrate
        end
    end
end
guidata(hObject,handles);


% --- Executes on button press in resetCalibration.
function resetCalibration_Callback(hObject, eventdata, handles)
% hObject    handle to resetCalibration (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
handles.calibrate = [];
for i = size(handles.calibrateDisplay,2):1:-1
    rect = handles.calibrateDisplay(i)
    delete(rect)
end
handles.calibrateDisplay
guidata(hObject,handles);



function readingX_Callback(hObject, eventdata, handles)
% hObject    handle to readingX (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of readingX as text
%        str2double(get(hObject,'String')) returns contents of readingX as a double

handles.cursorAuto = false;
handles.cursorX = str2double(get(hObject,'String'));
handles.cursorAuto
guidata(hObject,handles);

% --- Executes during object creation, after setting all properties.
function readingX_CreateFcn(hObject, eventdata, handles)
% hObject    handle to readingX (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function readingY_Callback(hObject, eventdata, handles)
% hObject    handle to readingY (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of readingY as text
%        str2double(get(hObject,'String')) returns contents of readingY as a double


% --- Executes during object creation, after setting all properties.
function readingY_CreateFcn(hObject, eventdata, handles)
% hObject    handle to readingY (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
