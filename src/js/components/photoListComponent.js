import React from 'react';
import PhotoListItem from './photoListItem';

class PhotoListComponent extends React.Component {
    #fcReg=React.createRef();
    #resizeEventHandler=()=>{
        const fcCurrentWidth = this.#fcReg.current.clientWidth;
        const currentColumnWidth = this.props.Width;
        const currentColumns=Math.floor(fcCurrentWidth / currentColumnWidth)
        this.props.OnResizeEvent(currentColumns<1 ? 1 : currentColumns);
    }

    constructor(props) {
        super(props);
        window.addEventListener('resize',this.#resizeEventHandler);
    }

    componentWillUnmount() {
        window.removeEventListener('resize',this.#resizeEventHandler);
    }

    componentDidMount() {
        this.#resizeEventHandler();
    }

    render() {
        const elements=this.props.ImageList;
        const imageWidth=this.props.Width;
        return (
        <div className="photos-container">
            <div className="fixed-container" ref={this.#fcReg} >
                {
                    elements.length>0 ?elements[0].map((elm,index)=>{ return (
                        <ul key={index} className="photos-list" style={{maxWidth:`${imageWidth}px`}}>
                            {
                                elements.map((image)=> image[index]!=undefined ?
                                    <li className='photos-list__item' key={image[index].id}
                                        onMouseEnter={(evt)=>{evt.currentTarget.classList.add('photohover'); }}
                                        onMouseLeave={(evt)=>evt.currentTarget.classList.remove('photohover')}>

                                        <PhotoListItem
                                            Image={image[index]}
                                            Width={imageWidth}
                                            WidthSteps={this.props.WidthSteps}
                                            OnLikeAction={this.props.OnLikeAction}
                                            WithLink={true}
                                            IsStatic={true}
                                            ImgDefaultWidth={this.props.ImgDefaultWidth}
                                            UrlData={this.props.UrlData}
                                        />
                                    </li> :null)
                            }
                        </ul>)
                    }) : null
                }
            </div>
        </div>
    )}
};

export default PhotoListComponent;