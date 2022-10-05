import React, { useEffect, useState } from 'react';
import './App.css';
import {Box, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {Html5Qrcode} from "html5-qrcode";
import {CameraDevice} from "html5-qrcode/core";

const qrCodeRegionId = "qr-code-scanner"

function App() {
    const [cameraList, setCameraList] = useState<CameraDevice[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string>("");
    const [qrCodeResult, setQrCodeResult] = useState<string>("");
    const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

    const handleCameraSelect = (event: SelectChangeEvent) => {
        event.preventDefault();

        setSelectedCamera(event.target.value);
    }

    useEffect(() => {
        Html5Qrcode.getCameras().then(cameraList => {
            setCameraList(cameraList);
            setSelectedCamera(cameraList[0].id);
        })
    }, []);

    const stopCurrentScanner = () => {
        if (scanner) {
            scanner.stop();
        }
    };

    useEffect(() => {
        if (selectedCamera !== "") {
            stopCurrentScanner();

            const htmlQrCode = new Html5Qrcode(qrCodeRegionId);

            htmlQrCode.start(
                selectedCamera,
                {
                    fps: 10,    // Optional, frame per seconds for qr code scanning
                    qrbox: { width: 250, height: 250 }  // Optional, if you want bounded box UI
                },
                (decodedText, decodedResult) => {
                    // do something when code is read
                    setQrCodeResult(prevState => {
                        if (prevState !== decodedText) {
                            return decodedText;
                        }

                        return prevState;
                    });
                },
                (errorMessage) => {
                    // parse error, ignore it.
                    setQrCodeResult(prevState => {
                        if (prevState !== errorMessage) {
                            return errorMessage;
                        }

                        return prevState;
                    });
                });

            setScanner(htmlQrCode);
        }

        return () => {
            stopCurrentScanner();
        }
    }, [selectedCamera]);

    return (
        <div className="App">
            <Container
                maxWidth={"xs"}
                style={{
                    marginTop: "2rem"
                }}
            >
                <div id={qrCodeRegionId}/>
                <br />
                <FormControl fullWidth>
                    <InputLabel id="camera-selector-label">Select camera</InputLabel>
                    <Select
                        labelId="camera-selector-label"
                        id="camera-selector"
                        value={selectedCamera}
                        label="Select camera"
                        onChange={handleCameraSelect}
                    >
                        {cameraList.map(camera => (
                            <MenuItem key={camera.id} value={camera.id}>{camera.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Box sx={{
                    marginTop: 2
                }}>
                    <Typography>Result</Typography>
                    <Typography>{qrCodeResult}</Typography>
                </Box>
            </Container>
        </div>
    );
}

export default App;
