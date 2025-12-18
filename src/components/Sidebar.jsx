import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { Link } from "react-router-dom"

import { theme } from "antd";
import { useTheme } from "../theme/ThemeContext";


const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const { token } = theme.useToken();
  const { isDark } = useTheme();
  const bgColor = token.colorBgContainer; // фон контейнера
  const borderColor = token.colorBorderSecondary; // цвет бордера
  
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col shadow-sm" style={{ backgroundColor: bgColor, borderRight: `1px solid ${borderColor}` }}>
        <div className="p-4 pb-2 flex justify-between items-center">

          <h3 className="font-bold text-lg">{expanded && (<><span className='text-blue-400'>Shaylan</span><span className='text-red-700'> Biz</span></>)}</h3>

           <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            style={{ backgroundColor: isDark ? token.colorBgElevated : undefined }}
          >
            {expanded ? <ChevronFirst color={isDark ? token.colorText : token.colorTextSecondary} /> : <ChevronLast color={isDark ? token.colorText : token.colorTextSecondary} />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded, token }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert, to }) {
  const { expanded, token } = useContext(SidebarContext)

  return (
    <Link 
      to={to}
      className={`relative flex items-center py-2 my-1 font-medium rounded-e-md cursor-pointer transition-colors group no-underline ${active 
          ? "from-indigo-200 to-indigo-100 pe-3 ps-2.5 text-red-700 border-s-red-700 border-s-4"
          : "hover:text-gray-800 hover:border-s-red-400 hover:border-s-4 hover:transition-all hover:duration-100 transition-all duration-100 ps-2 pe-3 hover:ps-0 text-gray-500 "
        }`}
      style={{
        color: active ? token.colorPrimary : token.colorTextSecondary,
        borderInlineStart: active ? `4px solid ${token.colorPrimary}` : '4px solid transparent',
      }}
    >
      {icon}

      <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
        { expanded ? text : ""}
      </span>

      {alert && (
        <div 
          className={`absolute right-2 w-2 h-2 rounded`}
          style={{ backgroundColor: token.colorPrimary }}
        />
      )}

      {!expanded && (
        <div className="
          absolute left-full rounded-md px-2 py-1 ml-6
          text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          style={{ backgroundColor: token.colorBgElevated, color: token.colorText }}
        >
          {text}
        </div>
      )}
    </Link>
  )
}
// export function SidebarItem({ icon, text, active, alert, to }) {
//   const { expanded } = useContext(SidebarContext)

//   return (
//     <Link 
//       to={to}
//       className={`
//         relative flex items-center py-2 my-1
//         font-medium rounded-e-md cursor-pointer
//         transition-colors group no-underline
        
//       `}
//     >
//       {icon}

//       <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
//         { expanded ? text : ""}
//       </span>

//       {alert && (
//         <div 
//           className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}
//         />
//       )}

//       {!expanded && (
//         <div className="
//           absolute left-full rounded-md px-2 py-1 ml-6
//           bg-indigo-100 text-indigo-800 text-sm
//           invisible opacity-20 -translate-x-3 transition-all
//           group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
//         ">
//           {text}
//         </div>
//       )}
//     </Link>
//   )
// }
