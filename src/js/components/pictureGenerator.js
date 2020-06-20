import React from 'react';

const pictureGenerator=(props)=>{
    const { Image,ImgDefaultWidth,Height=undefined,Width=undefined,WidthSteps,IsStatic=false}=props;

    const scale=Image.width/Image.height;

    const workWidthSteps=(IsStatic ? [Width,Width]  : WidthSteps).reverse();

    const getSrcSetForPPI=(xCount,stepData, imageType='jpg',withX=true)=> {
        let w,h;

        if (Width>0 && Height>0) {
            w=`&w=${!IsStatic ? stepData : Width}`;
            h=`&h=${Height}`;
        }

        if (Width>0 && Height===undefined) {
            w=`&w=${!IsStatic ? stepData : Width}`;
            h=`&h=${Math.round(Width/scale)}`;
        }

        if (Width===undefined && Height>0) {
            if (IsStatic) {
                w=`&w=${Math.round(Height*scale)}`;
                h=`&h=${Height}`;
            } else {
                w=`&w=${stepData}`;
                h=`&h=${Height}`;
            }
        }

        return `${Image.urls.raw}&fm=${imageType}&q=50&fit=crop${w}${h}&dpr=${xCount} ${withX ? `${xCount}x` : ''}`;
    }

    return(
        <picture>
            {
                workWidthSteps.slice(0,-1).map((item,index) => (
                    <source key={Image.id+index}
                            media={!IsStatic ? `(max-width:${item+1}px)` : '(all)'}
                            type={'image/webp'}
                            srcSet={
                                `${getSrcSetForPPI(1, workWidthSteps[index+1], 'webp')},
                                 ${getSrcSetForPPI(2, workWidthSteps[index+1], 'webp')},
                                 ${getSrcSetForPPI(3, workWidthSteps[index+1], 'webp')}`
                        }/>
                ))
            }
            {
                workWidthSteps.slice(0,-1).map((item,index) => (
                    <source key={Image.id+index*10000}
                            media={!IsStatic ? `(max-width:${item+1}px)` : '(all)'}
                            srcSet={
                                `${getSrcSetForPPI(1,workWidthSteps[index+1],)},
                             ${getSrcSetForPPI(2,workWidthSteps[index+1], )},
                             ${getSrcSetForPPI(3,workWidthSteps[index+1],)}`
                            }/>
                )) 
            }
            <img
                src={getSrcSetForPPI(1, ImgDefaultWidth,'jpg',false)}
                srcSet={
                    `${getSrcSetForPPI(2,ImgDefaultWidth )},
                     ${getSrcSetForPPI(3,ImgDefaultWidth)}`
                }
                alt={getSrcSetForPPI(1,ImgDefaultWidth,'jpg',false)}/>
        </picture>
    );
}

export default pictureGenerator;