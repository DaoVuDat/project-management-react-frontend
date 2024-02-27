import Lottie from 'lottie-react';
import lottieLoadingImg from "./lottie_loadingImg.json"

export const GlobalLoading = () => {
	return <Lottie animationData={lottieLoadingImg} loop/>
}
