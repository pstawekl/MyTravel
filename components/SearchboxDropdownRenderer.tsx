'use client'
import React from 'react';
import mapUtils, { MapUtils } from '../utils/MapUtils';
import { City } from '../utils/SearchboxUtils';
import { SearchboxComponent } from './Searchbox';

export interface DynamicSearchboxRendererProps {
    searchboxItems: City[];
    searchboxValue: string;
    searchboxInstance: SearchboxComponent;
}

export default function SerachboxDropdownRenderer(props: DynamicSearchboxRendererProps) {
    const [isVisible, setIsVisible] = React.useState<boolean>(true);
    const TAGNAME: string = "searchbox-dropdown"

    const style = {
        width: document.getElementsByClassName("serachbox-component")[0].clientWidth,
    }
    console.log(props.searchboxItems)
    return (
        isVisible && <div className={TAGNAME} style={style}>
            <ul className={TAGNAME + "-list py-3 mb-0"}>
                {
                    props.searchboxItems.filter(x =>
                        x?.name?.includes(props.searchboxValue) ||
                        x?.country?.includes(props.searchboxValue) ||
                        (Array.isArray(x?.otherNames) && x.otherNames.some(name => name.includes(props.searchboxValue)))
                    ).map((item, index) => {
                        return (
                            <a className={TAGNAME + "-item"} href="#" onClick={() => {
                                mapUtils.setMapPositions(item.location);
                                SearchboxComponent.setSearchboxValue(props.searchboxInstance, item?.name);
                                isVisible && setIsVisible(false);
                            }}>
                                <li key={index}>
                                    <span className={TAGNAME + "-item-name"}>{item.name}</span>
                                    <span className={TAGNAME + "-item-country"}>{item.code}</span>
                                    <span className={TAGNAME + "-item-flag"}>{item.flag_image}</span>
                                </li>
                            </a>
                        )
                    })
                }
            </ul>
        </div>
    )
}