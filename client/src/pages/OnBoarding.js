import Nav from '../components/Nav'
import {useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import * as faceapi from 'face-api.js';
import { storage } from "../config/firebase"
import { auth } from "../config/firebase"
import { ref, uploadBytesResumable, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import BottomNav from '../components/BottomNav'

const OnBoarding = () => {
    const [user, setUser] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: cookies.UserId,
        first_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        url: "",
        about: "",
        matches: [],
        qualities: ""

    })
    const [selfieDataUrl, setSelfieDataUrl] = useState(null)
    const [isUgly, setIsUgly] = useState(false)
    const [uglyText, setUglyText] = useState("")
    const [animateNotUgly, setAnimateNotUgly] = useState("")
    const [isSelfieTaken, setIsSelfieTaken] = useState(false)
    const [isSavingSelfie, setIsSavingSelfie] = useState(false)
    const [isTakingSelfie, setIsTakingSelfie] = useState(false)
    const [isWebcamVidHidden, setIsWebcamVidHidden] = useState(true)

    const userId = cookies.UserId;

    const getUser = async () => {
        
        // don't run the function if the user is not logged in 
        if (!userId) return;

        try {
            const response = await axios.get('https://tindoor-server.onrender.com/user', {
                params: {userId}
            })
            setUser(response.data)
            setFormData((prevState) => ({
                ...prevState,
                first_name: response.data.first_name,
                dob_day: response.data.dob_day,
                dob_month: response.data.dob_month,
                dob_year: response.data.dob_year,
                show_gender: response.data.show_gender,
                gender_identity: response.data.gender_identity,
                gender_interest: response.data.gender_interest,
                url: response.data.url,
                qualities: response.data.qualities
            }))
            console.log(response.data)

            // a horrible hack to be able to create security auth rules in the firebase 
            // signing in users to the firebase on the background 
            createUserWithEmailAndPassword(auth, response.data.email, response.data.hashed_password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("firebase user created");
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error.message);

                if(error.message.search("email-already-in-use") != -1) {
                    console.log("email already in use");

                    signInWithEmailAndPassword(auth, response.data.email, response.data.hashed_password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        console.log("firebase user signed in");
                        // ...
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(error);
                    });

                }
            });

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])


    useEffect(() => {
        if(isSavingSelfie) {
            handleSubmit();
        }
    }, [formData])
    

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('submitted')
        if (e) e.preventDefault()

        try {
            const response = await axios.put('https://tindoor-server.onrender.com/user', {formData})
            console.log(response)
            const success = response.status === 200

            // this causes a face-api error 
            // if (success) navigate('/dashboard')

            
            if (success) {
                
                console.log("database updated sucessfully");

                if(!isSavingSelfie) { 
                    //a hack to prevent the face-api error 
                    window.location.href = "../dashboard"
                } else {
                    setIsSavingSelfie(false); 
                }
            }

        } catch (err) {
            console.log(err)
        }

    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const qualityChange = (e) => {

        let checkedQualities = formData.qualities ? formData.qualities : "";
        let clickedQuality = e.target.value + " ";

        if (e.target.checked) {
            checkedQualities += clickedQuality;
            console.log("checked");
        } else {
            if(checkedQualities.search(clickedQuality) != -1) {
                checkedQualities = checkedQualities.replace(clickedQuality, "");
            }
            console.log("not checked");
        }

        console.log(checkedQualities);

        setFormData((prevState) => ({
            ...prevState,
            qualities: checkedQualities
        }))
    }

    const isQualityChecked = (quality) => {
        if (!formData.qualities) return false; 

        if(formData.qualities.search(quality) != -1) {
            return "checked"
        } else {
            return false
        }
    }

    const displayHeader = (e) => {
        if (user) {
            return "Your Profile"
        } else {
            return "Create Account"
        }
    }

    const displayQualities = (e) => {
        const qualities = [
            "greedy",
            "envious",
            "arrogant",
            "selfish",
            "cruel",
            "dishonest",
            "hypocritical",
            "lazy",
            "intolerant",
            "ignorant",
            "rude",
            "inflexible",
            "vindictive",
            "jealous",
            "spiteful",
            "stubborn",
            "apathetic",
            "conniving",
            "deceitful",
            "manipulative",
            "narcissistic",
            "obsessive",
            "paranoid",
            "pessimistic",
            "vengeful",
            "aggressive",
            "callous",
            "defensive",
            "evasive",
            "fanatical",
            "insensitive",
            "egotistical",
            "uncaring",
            "untrustworthy",
            "bitter",
            "furtive",
            "hateful",
            "haughty",
            "indifferent",
            "irresponsible",
            "judgmental",
            "macho",
            "materialistic",
            "narrow-minded",
            "obnoxious",
            "overcritical",
            "petty",
            "resentful",
            "sarcastic",
            "scheming",
            "superficial",
            "unappreciative",
            "uncooperative",
            "unreliable",
            "vulgar",
            "whiny",
            "xenophobic",
            "yappy",
            "zealous",
            "devious",
            "fickle",
            "gloomy",
            "insincere",
            "moody",
            "needy",
            "quarrelsome",
            "shifty",
            "timid",
            "volatile",
        ];

        let qualityOptions = []; 

        qualities.forEach((quality, index) => {
            qualityOptions.push(
                <span key={index}>
                    <input 
                        type='checkbox' 
                        name="qualities"
                        value={quality}
                        id={quality}
                        onChange={qualityChange}
                        checked={isQualityChecked(quality)}
                    />
                    <label htmlFor={quality}>{quality}</label>
                </span>
            );
        });

        return qualityOptions;
    }

    const getFaceDetectorOptions = (e) => {
        const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
        const TINY_FACE_DETECTOR = 'tiny_face_detector'
        // ssd_mobilenetv1 options
        let minConfidence = 0.5
        // tiny_face_detector options
        let inputSize = 512
        let scoreThreshold = 0.5
        let selectedFaceDetector = SSD_MOBILENETV1
        return selectedFaceDetector === SSD_MOBILENETV1
            ? new faceapi.SsdMobilenetv1Options({ minConfidence })
            : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
    }

    function getCurrentFaceDetectionNet() {
        return faceapi.nets.ssdMobilenetv1
    }
    
    function isFaceDetectionModelLoaded() {
        return !!getCurrentFaceDetectionNet().params
    }

    const onPlay = async (e) => {
        const videoEl = document.querySelector('#inputVideo')
        const options = getFaceDetectorOptions()
        const result = await faceapi.detectSingleFace(videoEl, options).withFaceExpressions()

        if(typeof result !== 'undefined' && 
        (result.expressions.angry > 0.8 ||
        result.expressions.disgusted > 0.8 ||
        result.expressions.fearful > 0.8 ||
        result.expressions.surprised > 0.8
        )) {
            setUglyText("God you're UGLY!");
            setIsUgly(true);
        } else {
            setUglyText("Not ugly enough, try harder!");
            setIsUgly(false);
        }

        // document.querySelector("#testExpressionResult").innerHTML = isUglyText;

        if(videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
            return setTimeout(() => onPlay())

        setTimeout(() => onPlay())
    }


    const launchCameraEmotionDetection = async (e) => {

        setIsWebcamVidHidden(false);

        const MODEL_URL = '/models'

        await faceapi.loadFaceExpressionModel(MODEL_URL);
        await faceapi.loadSsdMobilenetv1Model(MODEL_URL);

        // try to access users webcam and stream the images
        // to the video element
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
        const videoEl = document.querySelector('#inputVideo')
        videoEl.srcObject = stream;

        setIsTakingSelfie(true);
    }


    const takeSelfie = (e) => {
      if(isUgly) {
        const imageToSave = document.querySelector('#imageToSave');
        const canvas = document.querySelector('#screencapture');
        // draw image
        let video = document.querySelector('#inputVideo');
        canvas.getContext('2d').drawImage(video, 0, 0, 300, 150);
        //create a dataUrl
        let dataUrl = canvas.toDataURL('image/jpg');
        //imageToSave.src = dataUrl;
        setSelfieDataUrl(dataUrl);
        setIsSelfieTaken(true);
        setIsTakingSelfie(false);
      } else {
        setAnimateNotUgly("animated");
        setTimeout(() => {
            setAnimateNotUgly("");
        }, 300);
      }
    }


    const uploadSelfie = async (e) => {

        if (!selfieDataUrl) return;

        const storageRef = ref(storage, `avatars/${cookies.UserId}.jpg`);

        uploadString(storageRef, selfieDataUrl, 'data_url').then((snapshot) => {
            console.log('Uploaded a data_url string!');
            getDownloadURL(snapshot.ref).then(async (fileUrl) => {

                console.log("sucess!");
                console.log(fileUrl);

                setIsSavingSelfie(true);

                setIsSelfieTaken(false);

                setFormData((prevState) => ({
                    ...prevState,
                    url: fileUrl
                }))
            });
        });
    }

    const discardSelfie = (e) => {
        setIsSelfieTaken(false);
    }
    

    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />

            <div className="onboarding">
                <h2>{displayHeader()}</h2>

                <form onSubmit={handleSubmit}>
                    <section>

                        <label htmlFor="url">Profile Photo</label>
                        {/* <input
                            type="url"
                            name="url"
                            id="url"
                            value={formData.url}
                            onChange={handleChange}
                            required={true}
                        /> */}
                        <div className="photo-container">
                            {formData.url && <div className='profilePhotoPreview' style={{backgroundImage: `url(${formData.url})`}}></div>}
                        </div>  

                        <span onClick={launchCameraEmotionDetection} className='ctaButton'>
                            Reveal yourself!
                        </span>
                        <br/>

            
                        

    
                        <div className='videoContainer'>
                            
                            <video onLoadedMetadata={onPlay} id="inputVideo" 
                                autoPlay 
                                muted 
                                playsInline
                                className={isWebcamVidHidden ? "hidden" : "visible"}
                            ></video>
                            
                            <div className={'selfieResultOverlay ' + (isSelfieTaken ? "active" : "inactive")}>
                                
                                {/* <img src={selfieDataUrl} id="imageToSave" alt=""/> */}
                                <div id='imageToSave' style={{backgroundImage: `url(${selfieDataUrl})`}}></div>

                                <div id="uploadSelfie" onClick={uploadSelfie} className='ctaButton'>save</div>
                                <div id="" onClick={discardSelfie} className='ctaButton'>discard</div>
                            </div>

                        </div>


                        <br/><br/>



                        <div id="selfieButton" onClick={takeSelfie} 
                        className={
                            (isUgly ? "active" : "inactive") + 
                            (isTakingSelfie ? " visible" : " hidden")}></div>

                        <div id="testExpressionResult" 
                            className={
                                (isUgly ? "ugly" : "notUgly " + animateNotUgly) + 
                                (isTakingSelfie ? " visible" : " hidden")}>

                                {uglyText}
                        </div>
                        
                        <canvas id="screencapture"></canvas>
                        
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <div className="multiple-input-container dateOfBirth">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Man</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>
                            <input
                                id="more-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="more"
                                onChange={handleChange}
                                checked={formData.gender_identity === "more"}
                            />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        <div className='showGenderContainer'>
                            <input
                                id="show-gender"
                                type="checkbox"
                                name="show_gender"
                                className='showGender'
                                onChange={handleChange}
                                checked={formData.show_gender}
                            />
                            <label htmlFor="show-gender">Show Gender on my Profile</label>
                        </div>

                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_interest === "man"}
                            />
                            <label htmlFor="man-gender-interest">Man</label>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_interest === "woman"}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData.gender_interest === "everyone"}
                            />
                            <label htmlFor="everyone-gender-interest">Everyone</label>

                        </div>

                         

                        <label htmlFor="about">About me</label>

                        <div className="multiple-checkboxes">
                            
                                {displayQualities()}
                         
                        </div>   

                        {/* <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I like long walks..."
                            value={formData.about}
                            onChange={handleChange}
                        /> */}
                         

                        <input type="submit"/>
                    </section>

                    

                </form>
            </div>
            <BottomNav></BottomNav>
        </>
    )
}
export default OnBoarding
