import React from 'react';

const imageSearch=(props)=>{
    const inputElementRef=React.createRef();

    const {EntryComplited}=props;

    const onFormSubmit=(evt)=>{
        EntryComplited (inputElementRef.current.value);
        inputElementRef.current.value='';
        inputElementRef.current.blur();
        evt.preventDefault();
    };

    const onKeyPressed=(evt)=>
        (evt.key.match(/[a-zA-Zа-яА-Я0-9\s\b]/u) === null) ? evt.preventDefault() : null;

    return (
        <form className="search-form" onSubmit={onFormSubmit}>
            <fieldset className="search-form-fieldset">
                <legend></legend>
                <div className="search-form-fieldset-int">
                    <button type='submit' aria-label='submit' className='search-form-fieldset__submit'>
                        <img src='../img/search.png' srcSet='../img/search.png 1x,../img/search@2x.png 2x,../img/search@3x.png 3x'/>
                    </button>
                    <input ref={inputElementRef}
                           className="search-form-fieldset__groupname-input"
                           type="text"
                           placeholder="Поиск по описанию"
                           onKeyPress={onKeyPressed}
                    />
                    <button type='submit' aria-label='submit' className='search-form-fieldset__submit'>Найти</button>
                </div>
            </fieldset>
        </form>
    );
};

export default imageSearch;