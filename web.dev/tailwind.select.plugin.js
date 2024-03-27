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

        const defSpacingX=spacing['1.5'];
        const defSpacingY=spacing['2'];
        const defBorderRadius=borderRadius.DEFAULT;
        const defColor=rgb(theme('colors.gray.400'));
        const defColorFocus=rgb(theme('colors.primary.500'));


        const rules=[];
        // select style
        rules.push({
            class:'.Select',
            styles:{
                'position':'relative',
                'z-index':0,
                'select':{
                    'position':'absolute',
                    'height':'20px',
                    'max-width':'22px',
                    'display':'none',
                },
            },
        });  

        // input style
        rules.push({
            class:'.SelectInput',
            styles:{
                'appearance':'none',
                'outline':'none',
                'flex':'auto',
                'position':'relative',
                'z-index':'1',
                'background':'none', 
                'transition':'opacity 174ms ease-in-out',
                '&.hide':{
                    'opacity':'0',
                },
            },
        });       

        // Select wrapper
        rules.push({
            class:'.SelectWrap',
            styles:{
                'position':'relative',
                'display':'grid',
                'z-index':'0',
            },
        });

        // select controls
        rules.push({
            class:'.SelectControls',
            styles:{
                'flex':'auto',
                'flex-wrap':'wrap',
                'display':'flex',
                'align-items':'center',
                'gap':'5px',
                'position':'relative',
            },
        });

        // select arrows
        rules.push({
            class:'.SelectArrows',
            styles:{
                'display':'flex',
            },
        });

        // select arrow
        rules.push({
            class:'.SelectArrow',
            styles:{
                '--tw-bg':defColor,
                '--tw-opacity':'0.375',
                'position':'relative',
                'height':'100%',
                'display':'flex',
                'align-items':'center',
                'justify-content':'center',
                'cursor':'pointer',
                'padding': '3px 5px',
                'background-color':'rgba(var(--tw-bg),var(--tw-opacity))',
                'opacity':'var(--tw-opacity)',   

                'svg':{
                    'fill':`rgba(${rgb(theme('colors.primary.900'))},1)`,
                },
                '&:hover' :{
                    '--tw-opacity':'1'
                }
            },
        });

        // select arrow drop down
        rules.push({            
            class:'.SelectArrowDropDown',            
            styles:{        
                'position':'relative',
                'width':'20px',
                '&::after':{
                    'position':'absolute',
                    'content':'"\\0020"',                    
                    'height':'6px',
                    'width':'6px',
                    'transform-origin':'66% 66%',
                    'transform':'rotate(45deg)',
                    'margin-top':'-3px',
                    'margin-right':'-3px',
                    'right':'50%',
                    'top':'50%',
                    'transition':'all .15s ease-in-out',
                    'border-bottom':'solid 2px black',
                    'border-right':'solid 2px black',
                },
            },
        });

        // select BOX
        rules.push({
            class:'.SelectBox',
            styles:{
                'position':'relative',
                'z-index':'1',
                'display':'flex',
                'gap':'2px',
            },
        });

        // select dropbox
        rules.push({
            class:'.SelectDropBox',
            styles:{
                'position':'absolute',
                'width':'100%',
            },
        })

        // default ring style
        rules.push({
            //class:inputRings,
            class:'.SelectBox, .SelectDrowDown',
            styles:{
                "--tw-bg":theme("colors.white"),
                "--tw-border-color":defColor,
                "--tw-ring-offset-x":"0",
                "--tw-ring-offset-y":"0",
                "--tw-ring-blur":"0",
                "--tw-ring-width":"1px",
                "--tw-ring-color":defColorFocus,
                "--tw-ring-opacity":"0.75",
                'background-color':'var(--tw-bg)',
                'border':'solid 1px rgb(var(--tw-border-color),1)',
                'border-radius':`${defBorderRadius}`,
                'transition': 'all .2s cubic-bezier(0.5, 0, 0, 1.25), opacity .15s ease-out',
            },
        });       

        rules.push({
            class:'.SelectDropDown',
            styles:{
                'position':'absolute',
                'z-index':'0',
                'width':'100%',
                'left':'0',
                'min-height':'58px',
                'max-height':'150px',
                'overflow-y':'auto',
                'transform-origin':'50% 0',
                'transform': 'scale(1) translateY(10px)', 
                'opacity':'0',
                'visibility':'hidden',
                'background-color':'#fff',
            },
        });

        rules.push({
            class:'.SelectItem',
            styles:{
                '--tw-bg':rgb(theme('colors.primary.500')),
                '--tw-opacity':'0.0',
                'padding':'3px 4px',
                'cursor':'pointer',
                'text-overflow':'ellipsis',
                'overflow':'hidden',
                'white-space':'nowrap',
                'background-color':'rgba(var(--tw-bg),var(--tw-opacity))',
                '&:hover':{ '--tw-opacity':'0.15'}, 
                '&.selected':{ '--tw-opacity':'0.75', 'color': `#fff` },
                '&.focus':{ '--tw-opacity':'0.25'},
            },
        });

        // select placeholder
        rules.push({
            class:'.SelectPlaceholder',
            styles:{
                'position':'absolute',
                'width':'100%',
                'white-space':'nowrap',
                'text-overflow':'ellipsis ellipsis',
                'overflow':'hidden',
                'width':'95%',
                'opacity':'0.40',
            },
        })
        
        // select label
        rules.push({
            class:'.SelectLabel',
            styles:{
                'z-index':'0',
                'position':'relative',
                'box-sizing':'border-box',                
                'opacity':'1',
                'transition':'opacity 175ms ease-in-out',
                '&.hide':{
                    'opacity':'0',
                },
            },
        });

        // select label val
        rules.push({
            class:'.SelectLabelVal',
            styles:{
                'text-overflow':'ellipsis',
                'overflow':'hidden',
                'white-space':'nowrap',
            },
        })

        rules.push({
            class:'.Select.open',
            styles:{
                'z-index':'1',
                '.SelectArrowDropDown:after':{
                    'transform':'rotate(225deg)',
                },
                '.SelectDropDown':{
                    'opacity':'1',
                    'visibility':'visible',
                },  
            },
        });
              

        // select single
        rules.push({
            class:'.Select.single',
            styles:{
                '.SelectLabel':{
                    'position':'absolute',
                    'width':'100%',
                },
            },
        });

        // select multiple
        rules.push({
            class:'.Select.multiple',
            styles:{                
                '.SelectLabel':{
                    'display':'flex',
                    //'align-items':'center',
                    'justify-items':'stretch',
                    'gap':'5px',
                    'box-shadow':`0 0 1px 0 ${theme('colors.gray.500')}`,
                    'border-radius':'3px',
                    'cursor':'pointer',
                    'max-width':'37%',
                    '&.hide':{
                        'opacity':'1',
                    },
                    '&:hover':{
                        'background-color':theme("colors.gray.200"),
                        '.SelectLabelValRem':{
                            'background-color':theme('colors.red.300'),
                        },
                    },
                },
                '.SelectLabelVal':{
                    'display':'inline-block',
                    'padding-left':'2px',
                    'padding-right':'2px',                    
                },
                '.SelectLabelValRem':{
                    'position':'relative',
                    'cursor':'pointer',
                    'padding':'2px',
                    'display':'flex',
                    'align-items':'center',
                },
            },
        });

        // select spinner for loading
        // select spinner
        rules.push({
            class:'@keyframes select_spinner',
            styles:{
                '0%':{ 'transform':'translateY(-50%) rotate(0deg)'},
                '100%':{ 'transform':'translateY(-50%) rotate(380deg)'},
            },
        });
        // select loading
        rules.push({
            class:'.SelectLoading',
            styles:{
                'position':'absolute',
                'left':'0',
                'top':'0',
                'z-index':'1',
                'width':'100%',
                'height':'100%',
                '&:after':{
                    'content':'"\\0020"',
                    'position':'absolute',
                    'border-radius':'50%',
                    'left':'10px',
                    'top':'50%',
                    'width':'18px',
                    'height':'18px',
                    'transform':'translateY(-50%)',
                    'animation':'select_spinner 0.5s linear infinite',
                    'border':`2px solid transparent`,
                    'border-left-color':`${theme('colors.red.500')}`,
                    'border-right-color':`${theme('colors.red.500')}`,
                },
            },
        })

        const getStrategyRules = (strategy) => rules
                            .map((rule) => {
                                if(rule[strategy])
                                {
                                    return { [rule[strategy]]: rule.styles }
                                }

                                return null;
                                //if (rule[strategy] === null) return null
                                //return { [rule[strategy]]: rule.styles }
                            })
                            .filter(Boolean);    
                            
        addComponents(getStrategyRules("class"));
    }
});

module.exports = forms