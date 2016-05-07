CameraGUI - spectrometer
Daniel Chen Apr 2016

This is a graphic user interface that allows one to control the cameras connected to the computer/laptop and be able to control the camera properties such as exposure, framerate, resolution, etc.

If connected to the spectrometer, it can use the camera data to generate a plot of absorption vs wavelength for a given light.

First-time setup
1. Connect the spectrometer via usb - one for the camera, one for rotating the diffraction grating
2. Ensure that the driver for the camera is installed on the computer.
	- If not,
	a) Go to device manager
	b) going to Imaging devices
	c) right click device and click "Update Driver Software"
	d) either search automatically, or download off the company's page
3. If connected through matlab, navigate to this file location, and type in "CameraGUI" in the Command Window
   If not, download using the "MyAppInstaller_web.exe" file, and run the application (note this may have some bugs)
4. Select the proper camera through the dropdown
5. Select the best resolution (smaller resolutions may not catch the entire camera)
6. Calibrate the spectrometer
	a) shine a light of specific wavelength through
	b) click on the "Calibrate Wavelength" button, and enter a wavelength in nm 
	c) This will show a line on the live feed that corresponds to that wavelength

These settings will be saved next time you open the application


Using the application
You can generate a plot on the right displaying absorption vs wavelength.
1. Click on the "Select Box" button and click and drag in the live feed
2. Click Start Recording

The X range and Y range show the range that the graph is showing.
The x and y values act like a cursor for the graph.
The x range, y range, and x and y values are automatically picked (default highest value). 
However, they can be manually changed (except y value) whenever their value reaches a steady-state.

All the properties like exposure and gain can be changed manually to whatever is needed.
Note, when set to automatic, the bar doesn't update the value. A workaround is to change it to manual then automatic again.


Arduino
The arduino connects via usb to rotate the diffraction grating. It also needs to be connected to a 12V source, with about 0.3A.
This currently works through matlab, the application would not work. However, you need to download arduino support package for matlab. The current support package may have errors, so follow this link to solve: http://www.mathworks.com/matlabcentral/answers/268379-i-can-t-connect-my-adafruit-motorshield-v2-3-with-matlab2014a#comment_343753.
Rotating the arduino will cause the entire camera to shift wavelengths. Counterclockwise - towards lower wavelengths. The exact amount it changes can be calibrated.