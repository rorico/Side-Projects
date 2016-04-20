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

% Last Modified by GUIDE v2.5 23-Mar-2016 14:39:51

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
preferencesFile = which('Preferences.txt');
defaultCamera = 1;
if ~isempty(preferencesFile)
    preferences = load(preferencesFile,'-mat',['cameraNumber'])
    if isprop(preferences,'cameraNumber')
        defaultCamera = preferences.CameraNumber;
    end
end

%imaqregister(strcat(pwd,'\TISImaq_R2013.dll'))
% Initialize camera
handles.output = hObject;
caminfo = imaqhwinfo
adaptors = caminfo.InstalledAdaptors();
cnt = 1;
cameraList = {};
adaptorList = {};
deviceNumbers = []; %assume these are all same size always
for i = 1:size(adaptors,2)
    adaptorName = char(adaptors(i));
    adaptor = imaqhwinfo(adaptorName)
    devices = adaptor.DeviceInfo();
    for j = 1:size(devices,2)
        cameraList{cnt} = devices(:,j).DeviceName;
        adaptorList{cnt} = adaptorName;
        deviceNumbers(cnt) = j;
        cnt = cnt + 1;
    end
end
if ~isempty(preferencesFile)
    save(preferencesFile);
end
%cameraList

handles.cameraList=cameraList;
handles.adaptorList=adaptorList;
handles.deviceNumbers=deviceNumbers;
handles.preferencesFile=preferencesFile;
guidata(hObject,handles);

if isempty(adaptorList)
    h=errordlg('No Cameras Attached');
elseif defaultCamera >= cnt
    defaultCamera = 1;
end

%setup with first device
set(handles.CameraList, 'String', cameraList);
set(handles.CameraList, 'Value', 1);
setup_camera(handles,hObject,defaultCamera);


function setup_camera(handles,hObject,cameraNumber)
%function for changing camera
%resets nearly all handles
if ~isempty(handles.preferencesFile)
    save(handles.preferencesFile,'cameraNumber','-append');
end
%first of list of connected devices
adaptorList = handles.adaptorList;
deviceNumbers = handles.deviceNumbers;
mycam = adaptorList{cameraNumber};
mycaminfo = imaqhwinfo(mycam);
devices = mycaminfo.DeviceInfo();
resolution = char(devices(deviceNumbers(cameraNumber)).SupportedFormats());
resolution_index = 1;   % set default resoultion to full res
vid = videoinput(mycam, deviceNumbers(cameraNumber),strtrim(resolution(resolution_index,:)));
src = getselectedsource(vid);

triggerconfig(vid, 'manual');   %set this for later usage
    
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
handles.device=deviceNumbers(cameraNumber);

%TESTESTSETSET
handles.calibrate = [];
handles.calibrateDisplay = [];
handles.readingXval = [];
handles.readingYval = [];
%TESTESTSETEST

% Populate supported resolution menu
set(handles.SupportedResolutions, 'String', resolution);
set(handles.SupportedResolutions, 'Value', resolution_index);

% Populate supported framerate menu
frameRates = set(src, 'FrameRate');
frameRates=frameRates';
set(handles.SupportedFrameRates, 'String', frameRates);

% Move Exposure slider to default position
if isprop(src,'Exposure')
    ExposureInfo = propinfo(src,'Exposure');
    ExposureRange = ExposureInfo.ConstraintValue();
    handles.minExposure = ExposureRange(1);
    handles.maxExposure = ExposureRange(2);
    handles.defaultExposure=handles.src.Exposure;
    exposureSlider=double(abs(handles.defaultExposure-handles.minExposure))/double(abs(handles.maxExposure-handles.minExposure));
    set(handles.Exposure, 'value', exposureSlider);
    set(handles.Exposure, 'Enable', 'on');
else
    set(handles.Exposure, 'Enable', 'off');
end

% Move Brightness slider to default position
if isprop(src,'Brightness')
    BrightnessInfo = propinfo(src,'Brightness');
    BrightnessRange = BrightnessInfo.ConstraintValue();
    handles.minBrightness = BrightnessRange(1);
    handles.maxBrightness = BrightnessRange(2);
    handles.defaultBrightness=handles.src.Brightness;
    brightnessSlider=double(abs(handles.defaultBrightness-handles.minBrightness))/double(abs(handles.maxBrightness-handles.minBrightness));
    set(handles.Brightness, 'value', brightnessSlider);
    set(handles.Brightness, 'Enable', 'on');
else
    set(handles.Brightness, 'Enable', 'off');
end

% Move Gain slider to default position
if isprop(src,'Gain')
    GainInfo = propinfo(src,'Gain');
    GainRange = GainInfo.ConstraintValue();
    handles.minGain = GainRange(1);
    handles.maxGain = GainRange(2);
    handles.defaultGain=handles.src.Gain;
    gainSlider=double(abs(handles.defaultGain-handles.minGain))/double(abs(handles.maxGain-handles.minGain));
    set(handles.Gain, 'value', gainSlider);
    set(handles.Gain, 'Enable', 'on');
else
    set(handles.Gain, 'Enable', 'off');
end

% Move Contrast slider to default position
if isprop(src,'Contrast')
    ContrastInfo = propinfo(src,'Contrast');
    ContrastRange = ContrastInfo.ConstraintValue();
    handles.minContrast = ContrastRange(1);
    handles.maxContrast = ContrastRange(2);
    handles.defaultContrast=handles.src.Contrast;
    contrastSlider=double(abs(handles.defaultContrast-handles.minContrast))/double(abs(handles.maxContrast-handles.minContrast));
    set(handles.Contrast, 'value', contrastSlider);
    set(handles.Contrast, 'Enable', 'on');
else
    set(handles.Contrast, 'Enable', 'off');
end

% Move Gamma slider to default position
if isprop(src,'Gamma')
    GammaInfo = propinfo(src,'Gamma');
    GammaRange = GammaInfo.ConstraintValue();
    handles.minGamma = GammaRange(1);
    handles.maxGamma = GammaRange(2);
    handles.defaultGamma=handles.src.Gamma;
    gammaSlider=double(abs(handles.defaultGamma-handles.minGamma))/double(abs(handles.maxGamma-handles.minGamma));
    set(handles.Gamma, 'value', gammaSlider);
    set(handles.Gamma, 'Enable', 'on');
else
    set(handles.Gamma, 'Enable', 'off');
end

% Move Sharpness slider to default position
if isprop(src,'Sharpness')
    SharpnessInfo = propinfo(src,'Sharpness');
    SharpnessRange = SharpnessInfo.ConstraintValue();
    handles.minSharpness = SharpnessRange(1);
    handles.maxSharpness = SharpnessRange(2);
    handles.defaultSharpness=handles.src.Sharpness;
    sharpnesSlider=double(abs(handles.defaultSharpness-handles.minSharpness))/double(abs(handles.maxSharpness-handles.minSharpness));
    set(handles.Sharpness, 'value', sharpnesSlider);
    set(handles.Sharpness, 'Enable', 'on');
else
    set(handles.Sharpness, 'Enable', 'off');
end

guidata(hObject,handles);
% This sets up the initial plot - only do when we are invisible
% so window can get raised using CameraGUI.



% UIWAIT makes CameraGUI wait for user response (see UIRESUME)
% uiwait(handles.figure1);


% --- Executes on button press in SupportedResolutions.
function SupportedResolutions_Callback(hObject, eventdata, handles)
% hObject    handle to ROI (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
axes(handles.PreviewAxes);
cla;

% Change video object resolution Settings
resolution_index = get(handles.SupportedResolutions, 'Value');
vid=videoinput(handles.mycam, handles.device, strtrim(handles.resolution(resolution_index,:)));
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
    pastX = [0,0];
    pastY = [0,0];
    pastCursor = 0;
    
    if get(hObject, 'Value') == 1   %start recording
        if isdeployed
            start(handles.vid);
        end
    else                            %stop recording
        datacursormode on % show cursors after stop recording
        if isdeployed
            stop(handles.vid);
        end
    end
    
    % Continues to record until specified to stop
    while get(hObject, 'Value')==1
        
        % Pauses capture when pause button is clicked. Resumed when clicked
        % again
        while get(handles.Pause,'Value')==1
            datacursormode on;
            pause(1);
        end
        datacursormode off;
        
        
        img=getsnapshot(handles.vid); % Capture preview image
        if isdeployed
            axes(handles.PreviewAxes);
            image(img);
            rectangle('Position',handles.ROI, 'EdgeColor', 'r', 'Linewidth', 2);
        end
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
        if ~str2num(get(handles.cursorAuto,'String'))
            [maxLine, index] = max(yvals);
            set(handles.readingY,'String',maxLine);
            set(handles.readingX,'String',xvals(index));
        else
            x = str2num(get(handles.readingX,'String'));
            i = 1 + (x - xvals(1)) / m;
            y2 = yvals(ceil(i));
            y1 = yvals(floor(i));
            m = y2 - y1;
            y = y1 + (i - floor(i)) * m;
            if y ~= pastCursor
                set(handles.readingY,'String',y);
            else
                pastCursor = y;
            end
        end
        axes(handles.ReadingAxes);
        plot(xvals,yvals,'-');
        ylabel('average hits');
        xlabel('wavelength (nm)');
        if str2num(get(handles.yLimAuto,'String'))
            ylimits = str2num(get(handles.yLim,'String'));
            if ~isempty(ylimits)
                ylim(ylimits)
            end
        elseif ylim ~= pastY%~strcmp(get(handles.yLim,'String'),mat2str(ylim))
            set(handles.yLim,'String',mat2str(ylim));
            pastY = ylim;
        end
        
        if str2num(get(handles.xLimAuto,'String'))
            xlimits = str2num(get(handles.xLim,'String'));
            if ~isempty(xlimits)
                xlim(xlimits)
            end
        elseif xlim ~= pastX%~strcmp(get(handles.yLim,'String'),mat2str(ylim))
            set(handles.xLim,'String',mat2str(xlim));
            pastX = xlim;
        end
        pause(time_delay);
    end
end


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


% --- Executes on button press in Calibrate.
function Calibrate_Callback(hObject, eventdata, handles)
% hObject    handle to Calibrate (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)
wavelengthInputs = inputdlg('Enter Wavelength (nm)','Calibration Wavelength',1,{'500'});
if isempty(wavelengthInputs)
    return
end
wavelengthStr = wavelengthInputs{1};
if isempty(wavelengthStr)
    h=errordlg('Enter Wavelength');
else
    prefix = wavelengthStr(end-1);
    unitIndex = size(wavelengthStr,2);
    multiplier = 1;
    if wavelengthStr(end) == 'm'
        unitIndex = size(wavelengthStr,2) - 1;
        if prefix == 'm'
            multiplier = 1e6;
        elseif prefix == 'u'
            multiplier = 1e3;
        elseif prefix == 'n'
            multiplier = 1;
        elseif prefix == 'p'
            multiplier = 1e-3;
        elseif prefix == 'f'
            multiplier = 1e-6;
        else    %if just 'm'
            [num, status] = str2num(prefix);
            if status
                unitIndex = size(wavelengthStr,2);
            else
                h=errordlg('Cannot understand units');
            end
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
guidata(hObject,handles);

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
set(handles.cursorAuto,'String','1');
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



function yLim_Callback(hObject, eventdata, handles)
% hObject    handle to yLim (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of yLim as text
%        str2double(get(hObject,'String')) returns contents of yLim as a double
set(handles.yLimAuto,'String','1');
guidata(hObject,handles);


% --- Executes during object creation, after setting all properties.
function yLim_CreateFcn(hObject, eventdata, handles)
% hObject    handle to yLim (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function xLim_Callback(hObject, eventdata, handles)
% hObject    handle to xLim (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of xLim as text
%        str2double(get(hObject,'String')) returns contents of xLim as a double
set(handles.xLimAuto,'String','1');
guidata(hObject,handles);


% --- Executes during object creation, after setting all properties.
function xLim_CreateFcn(hObject, eventdata, handles)
% hObject    handle to xLim (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function xLimAuto_Callback(hObject, eventdata, handles)
% hObject    handle to xLimAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of xLimAuto as text
%        str2double(get(hObject,'String')) returns contents of xLimAuto as a double


% --- Executes during object creation, after setting all properties.
function xLimAuto_CreateFcn(hObject, eventdata, handles)
% hObject    handle to xLimAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function yLimAuto_Callback(hObject, eventdata, handles)
% hObject    handle to yLimAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of yLimAuto as text
%        str2double(get(hObject,'String')) returns contents of yLimAuto as a double


% --- Executes during object creation, after setting all properties.
function yLimAuto_CreateFcn(hObject, eventdata, handles)
% hObject    handle to yLimAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end



function cursorAuto_Callback(hObject, eventdata, handles)
% hObject    handle to cursorAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: get(hObject,'String') returns contents of cursorAuto as text
%        str2double(get(hObject,'String')) returns contents of cursorAuto as a double


% --- Executes during object creation, after setting all properties.
function cursorAuto_CreateFcn(hObject, eventdata, handles)
% hObject    handle to cursorAuto (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: edit controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end


% --- Executes on selection change in CameraList.
function CameraList_Callback(hObject, eventdata, handles)
% hObject    handle to CameraList (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    structure with handles and user data (see GUIDATA)

% Hints: contents = cellstr(get(hObject,'String')) returns CameraList contents as cell array
%        contents{get(hObject,'Value')} returns selected item from CameraList
axes(handles.PreviewAxes);
cla;

% Change video object resolution Settings
camera_index = get(handles.CameraList, 'Value');
setup_camera(handles,hObject,camera_index);   


% --- Executes during object creation, after setting all properties.
function CameraList_CreateFcn(hObject, eventdata, handles)
% hObject    handle to CameraList (see GCBO)
% eventdata  reserved - to be defined in a future version of MATLAB
% handles    empty - handles not created until after all CreateFcns called

% Hint: popupmenu controls usually have a white background on Windows.
%       See ISPC and COMPUTER.
if ispc && isequal(get(hObject,'BackgroundColor'), get(0,'defaultUicontrolBackgroundColor'))
    set(hObject,'BackgroundColor','white');
end
