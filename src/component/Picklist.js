import * as Common from './Common';
import axios from 'axios';
import { components } from "react-select";

let debounceTimer;
export const handleInputChange = (value) => {
    // setInputValue(value);
}

export const fetchLocationAllowedPicklist = (searchString) => {
    var obj = {
        sid: sessionStorage.getItem('sessionId'),
        type: 'locationallowed',
        srch: searchString
    };

    var result = axios.create({
        baseURL: Common.apiPicklist,
        headers: {},
    }).get('?1=' + JSON.stringify(obj)).then(result => {
        return JSON.parse(result.data);
    });

    return result;
}

export const fetchFollowUpPicklist = (searchString) => {
    var obj = {
        sid: sessionStorage.getItem('sessionId'),
        type: 'followup',
        srch: searchString,
    };

    var result = axios.create({
        baseURL: Common.apiPicklist,
        headers: {},
    }).get('?1=' + JSON.stringify(obj)).then(result => {
        return JSON.parse(result.data);
    });

    return result;
}

export const fetchCountryPicklist = (searchString) => {
    let obj = {
        type: 'country',
        srch: searchString,
        limit: 8,
        isAll: false
    };
    let result = axios.create({
        baseURL: Common.apiPicklist,
        headers: {},
    }).get('?1=' + JSON.stringify(obj)).then(result => {
        return JSON.parse(result.data);
    });
    return result;
}
export const fetchAllCountryPicklist = (searchString) => {
    let obj = {
        type: 'country',
        srch: searchString,
        limit: 0,
        isAll: true
    };
    let result = axios.create({
        baseURL: Common.apiPicklist,
        headers: {},
    }).get('?1=' + JSON.stringify(obj)).then(result => {
        return JSON.parse(result.data);
    });
    return result;
}


export const formatOptionLabel = ({ ID, label, desc }) => {
    const valArr = desc.split("^");
    const headerLength = valArr.length;
    console.log('props', `${100 / (headerLength)}%`)
    console.log(valArr);
    return (
        <div style={{ width: '100%', display: 'flex' }}>
            {valArr.map((data) =>
                <div style={{ display: 'table-cell', width: `${100 / (headerLength)}%`, paddingLeft: '1%' }}>
                    {data}
                </div>
            )}
        </div>
    )
}

export const menu = (props) => (
    <components.Menu {...props}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ width: '100%' }}>
                <tr style={{ width: '100%', display: 'flex', fontWeight: 'bold', backgroundColor: '#f8f9fa', }}>
                    <div style={{ width: '35%', paddingLeft: '3%' }}>Customer</div>
                    <div style={{ width: '20%', paddingLeft: '3%' }}>Date</div>
                    <div style={{ width: '34%', paddingLeft: '3%' }}>Name</div>
                    <div style={{ width: '24%', paddingLeft: '3%' }}>Remark</div>
                </tr>
            </thead>
            <tbody >
                {props.children}
            </tbody>
        </table>
    </components.Menu>
);

export const fetchConveraInstituteByCountry = (isdCode, searchString) => {
    return new Promise((resolve, reject) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            let obj = {
                type: 'allInstitute',
                srch: searchString,
                countryCode: isdCode,
                limit: 8,
                isAll: false
            };
            axios.create({
                baseURL: Common.apiPicklist,
                headers: {},
            }).get('?1=' + JSON.stringify(obj)).then((result) => {
                resolve(result.data);
            }).catch(reject);
        }, 300);
    });
};

// export const fetchConveraInstituteByCountry = (isdCode,searchString) => {
//     clearTimeout(debounceTimer);
//     debounceTimer = setTimeout(() => {
//         let obj = {
//             type: 'allInstitute',
//             srch: searchString,
//             countryCode: isdCode,
//             limit: 8,
//             isAll: false
//         };
//         let result = axios.create({
//             baseURL: Common.apiPicklist,
//             headers: {},
//         }).get('?1=' + JSON.stringify(obj)).then(result => {
//             console.log(result);
//             return JSON.parse(result.data);
//         });
//     }, 300);
//     return debounceTimer;
// }

