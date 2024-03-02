const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');
const { borderWidth, borderRadius, spacing } = defaultTheme;
const tinyColor=require("tinycolor2");

function rgb(color)
{
    const c=tinyColor(color).toRgb();
    const {r,g,b}=c;
    return `${[r,g,b].join(",")}`;
}

const forms=plugin.withOptions(function()
{
    return function ({addBase,addComponents,addUtilities,theme})
    {       
        const resolveFontSize=function(nm)
        {
            return theme("fontSize")[nm][0];
        };

        const resolveLineHeight=function(nm){
            return theme("fontSize")[nm][1].lineHeight;
        };

        const textSize=function(nm){
            return {
                'font-size':theme("fontSize")[nm][0],
                'line-height':theme("fontSize")[nm][1].lineHeight,                
            };
        };

        const colors=function(nm){
            return theme(`colors.${nm}`);
        };

        const rgba=function(nm=null,opacity){
            const color=colors(nm);
            if(opacity>=1)
            {
                return color;
            }
            const {r,g,b}=tinyColor(color).toRgb();
            return `rgba(${[r,g,b,opacity].join(',')})`;
        };

        const defSpacingX=spacing['1.5'];
        const defSpacingY=spacing['2'];
        const defBorderRadius=borderRadius.DEFAULT;
        const defColor=rgb(theme('colors.gray.400'));
        const defColorFocus=rgb(theme('colors.primary.500'));
        const bases= {
            'html,body':{
                ...textSize("base"),
            },
            'a':{
                'cursor':'pointer',
                'color':colors('primary.500'),
                '&:hover':{
                    'color':colors('primary.600'),
                },
            },
        };

        const nav={           
            'nav':{
                ' > ul, > ul > li ':{
                    'margin':'0',
                    'padding':'0',
                    'list-style':'none',
                },
                '> ul':{
                    'display':'flex',
                },
                'li,a':{
                    'display':'block',
                },
                'a':{
                    'color':colors("gray.500"),
                    'padding':`${spacing['1']} ${spacing['4']}`
                },
                'a:hover':{
                    'background-color':rgba("primary.500",0.275),
                    'color':colors("gray.600"),
                },
                'a.active':{
                    'background-color':rgba("primary.500",1),
                    'color':colors("white"),
                },
            }
        };

        addBase(bases);
        addComponents(nav);
    }
});

module.exports = forms