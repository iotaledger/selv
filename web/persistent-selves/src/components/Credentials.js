import React, { useEffect, useState, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const Credentials = () => {
    const [credentials, setCredentials] = useState();
    const code = useRef(null);

    useEffect(() => {
        async function getData () {
            const credentials = await localStorage.getItem('credentials');
            credentials && setCredentials(JSON.parse(credentials)?.data);
            highlight();
        }
        getData();
    }, []);
  
    const highlight = () => {
      try {
        hljs.highlightBlock(code.current);
      } catch (e) {
        console.log(hljs, window.hljs);
      }
    };

    return (
        <div className='credentials-wrapper'>
            <div className="highlightjs-component">
                <pre className="prettyprint lang-json">
                    <code className="json prettyprint lang-json" ref={code}>
                        { JSON.stringify(credentials, null, 2) }
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default Credentials;
