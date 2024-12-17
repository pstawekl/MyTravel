'use client'
import React, { useEffect, useState } from "react";
import { City, SearchboxType, SearchboxUtils } from '../utils/SearchboxUtils'
import SerachboxDropdownRenderer from "./SearchboxDropdownRenderer";

export class SearchboxComponent extends React.Component<any, any> {
    constructor() {
        super({});
        this.state = {
            searchboxValue: '',
            isSearchboxDropdown: false
        };
        this.clearSearchboxValue = this.clearSearchboxValue.bind(this);
    }

    clearSearchboxValue = () => {
        this.setState({ searchboxValue: "" });
    }

    static clearSearchboxValue = (componentInstance: SearchboxComponent) => {
        componentInstance.clearSearchboxValue();
    }

    setSearchboxValue = (value: string) => {
        this.setState({ searchboxValue: value });
    }

    static setSearchboxValue = (componentInstance: SearchboxComponent, value: string) => {
        componentInstance.setSearchboxValue(value);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevState.searchboxValue !== this.state.searchboxValue) {
            if (this.state.searchboxValue.length > 1) {
                this.setState({ isSearchboxDropdown: true });
            } else {
                this.setState({ isSearchboxDropdown: false });
            }
        }
    }

    render() {
        const { searchboxValue, isSearchboxDropdown } = this.state;

        return (
            <div className="searchbox w-100">
                <input
                    type="search"
                    name="searchbox"
                    className="serachbox-component w-100"
                    id="serachbox-component"
                    placeholder="Dokąd jedziemy?"
                    value={searchboxValue}
                    onChange={(e) => this.setState({ searchboxValue: e.target.value })}
                />
                {isSearchboxDropdown && (
                    <SerachboxDropdownRenderer
                        searchboxInstance={this}
                        searchboxItems={SearchboxUtils?.searchboxList}
                        searchboxValue={searchboxValue}
                    />
                )}
            </div>
        );
    }
}


// export default function Searchbox() {
//     const [searchboxValue, setSearchboxValue] = useState<string>('')
//     const [isSearchboxDropdown, setIsSearchboxDropdown] = useState<boolean>(false)

//     useEffect(() => {
//         if (searchboxValue.length > 1) {
//             setIsSearchboxDropdown(true);
//         } else {
//             setIsSearchboxDropdown(false);
//         }
//     }, [searchboxValue])

//     return (
//         <div className="searchbox w-100">
//             <input type="search" name="searchbox" className="serachbox-component w-100" id="serachbox-component" placeholder="Dokąd jedziemy?"
//                 value={searchboxValue} onChange={(e) => setSearchboxValue(e.target.value)} />
//             {
//                 isSearchboxDropdown && <SerachboxDropdownRenderer searchboxItems={SearchboxUtils?.searchboxList} searchboxInstance={this} searchboxValue={searchboxValue} />
//             }
//         </div>
//     )
// }