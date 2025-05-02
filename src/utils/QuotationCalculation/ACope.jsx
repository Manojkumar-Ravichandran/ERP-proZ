import { pichList } from "../../contents/Qutoation/RoofData";
import { rectangleArea, squareArea } from "./GeneralCal";

export function ACopeCal(payload) {
  let bottomBaseArea = 0;

  if (payload.width === payload.length) {
    bottomBaseArea = squareArea(payload.width);
  } else {
    if (Number(payload.width) > Number(payload.length)) {
      
      [payload.width, payload.length] = [payload.length, payload.width];
    }
    bottomBaseArea = rectangleArea(payload.length, payload.width);
  }

  
  

  const roofheight =findRoofVerticalHeight(payload.width, payload.roofPitch);
  const roofingPlaceLength = Number(findRoofingPlaceLength(payload.width, payload.roofPitch))+Number(1)
  
   

   const roofArea = rectangleArea(payload.roofLength, payload.roofWidth);
   

   const oneSideRoofTopArea = rectangleArea(roofingPlaceLength, payload?.length);
   
   const oneSideTotalSheet = Math.ceil(oneSideRoofTopArea/roofArea);
   const totalSheet = oneSideTotalSheet*2;
   
   

   const oneSideRodCount =   Math.ceil(((payload?.length/2.5)*roofingPlaceLength)/payload?.rodLength);
   const totalSideRodCount = oneSideRodCount*2;
   
    

    const oneSideHorizantalRodCount =   Math.ceil(((roofingPlaceLength/2.5)*payload?.length)/payload?.rodLength);
   const totalRodHorizantalCount = oneSideHorizantalRodCount*2;
   
    
    const topRodCount = Math.ceil(payload?.length/payload?.rodLength);
    

   const  totalRodCount = Number(totalSideRodCount)+Number(totalRodHorizantalCount)+Number(topRodCount);
    

    const screwCount = Math.ceil(totalSheet*8);
    
    
    const HJoinerCount = Math.ceil((payload?.length/payload?.hCupLength));
    

    const antiDustTapCount = Math.ceil(((payload?.length*2)/20));
    

    const sealingTapeCount = Math.ceil(((payload?.length*2)/10));
    

    const oneSidePillarCount = Math.ceil(((payload?.length)/10)+1);
    const totalPillarCount = oneSidePillarCount*2;
    
    

    const result = {
      bottomBaseArea,
      roofheight,
      roofingPlaceLength,
      roofArea,
      oneSideRoofTopArea,
      oneSideTotalSheet,
      totalSheet,
      oneSideRodCount,
      totalSideRodCount,
      oneSideHorizantalRodCount,
      totalRodHorizantalCount,
      topRodCount,
      totalRodCount,
      screwCount,
      HJoinerCount,
      antiDustTapCount,
      sealingTapeCount,
      oneSidePillarCount,
      totalPillarCount
    }

    return result;


}

const findRoofingPlaceLength = (width, aAngle) => {
   const angle = pichList.find((item) => item.name === aAngle)?.angle;
   const angleARadians = angle * (Math.PI / 180)
   const height = (width/2)*(Math.cos(angleARadians));
   return height;
}
const findRoofVerticalHeight = (width, aAngle) => {
   const angle = pichList.find((item) => item.name === aAngle)?.angle;
   const angleARadians = angle * (Math.PI / 180)
   const height = (width/2)*(Math.tan(angleARadians));
   return height;
}