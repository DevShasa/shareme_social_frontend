import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	userPins,
	userSaved,
	userPinsStatus,
	savedPinsStatus,
	getUserPins,
	getUserSavedPins,
} from "../reduxStore/dataSlices/userDetailSlice";
import { AiOutlineLogout } from "react-icons/ai";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { useParams, useNavigate } from "react-router-dom";
import { client } from "../sanity/client";
import { userQuery } from "../utils/sanityDataFetch";
import { googleLogout } from "@react-oauth/google";

const activeBtnStyles =
	"bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notactiveBtnStyle =
	"bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { userId } = useParams();
	const myPins = useSelector(userPins);
	const mySavedPins = useSelector(userSaved);
	// const savedStatus = useSelector(savedPinsStatus);
	// const pinsStatus = useSelector(userPinsStatus);

	const loggedInUserId = localStorage.getItem("subjectId");

	const [user, setUser] = useState();
	const [pinsToDisplay, setPinsToDisplay] = useState("Created");
	// const [pins, setPins] = useState();

	useEffect(() => {
		if (loggedInUserId) {
			const loggedInU = JSON.parse(localStorage.getItem("subjectId"));
			// does the logged in user match user params
			if (loggedInU === userId ) {
				const query = userQuery(loggedInU);
				client.fetch(query).then((data) => { setUser(data[0]);});
				dispatch(getUserPins(userId));
				dispatch(getUserSavedPins(userId));
			}
		} else {
			// no user, force login
			localStorage.clear();
			navigate("/login");
		}
	}, [userId, loggedInUserId, navigate, dispatch]);

	const logout = () => {
		localStorage.clear();
		googleLogout();
		navigate("/login");
	};

	if (!user) return <Spinner message="Loading your profile" />;

	return (
		<div className="relative pb-2 h-full">
			<div className="flex flex-col pb-5">
				<div className="relative flex flex-col mb-7">
					<div className="flex flex-col justify-center items-center">
						<img 
							className="w-full h-200 shadow-lg object-cover"
							src="https://source.unsplash.com/1600x900/?nature,photography,technology"
							alt="user-banner"
						/>
						<img 
							className="rounded-full w-14 h-14 -mt-7 object-cover border-4 border-black"
							src={user.userImgUrl}
							alt={user.userName}
						/>
					</div>
					<h1 className="font-bold text-3xl  text-center mt-3">
						{user.userName}
					</h1>
					<div className="absolute top-0 z-1 right-0 p-2">
						{user._id === userId && (
							<button 
									className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
									onClick={logout}
								>
								<AiOutlineLogout color="black" fontSize={21}/>
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
