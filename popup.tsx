import { useState } from "react"
import { SketchPicker } from "react-color"

import { useStorage } from "@plasmohq/storage"
import iconSrc from "url:./assets/devicon.png"
import "./style.css"

function IndexPopup() {
  const [data, setData] = useState("")
  const [appliedColor, setAppliedColor] = useStorage("appliedColor", "#4b9e59")
  const [bannedColor, setBannedColor] = useStorage("bannedColor", "#eb5f4d")
  const [bannedJobTitles, setBannedJobTitles] = useStorage(
    "bannedJobTitles",
    []
  )

  //had to use a string value here because booleans were not working
  //not sure if its a bug or a feature but it works
  const [hideBannedJobs, setHideBannedJobs] = useStorage(
    "hideBannedJobs",
    "false"
  )

  const [bannedTerm, setBannedTerm] = useState("")

  const [showBannedColorPicker, setShowBannedColorPicker] = useState(false)
  const [showAppliedColorPicker, setShowAppliedColorPicker] = useState(false)

  chrome.management.getSelf((self) => {
    console.log("install type",self.installType)
    if (self.installType === "development") {
      console.log("development version")
    chrome.action.setIcon({ path: iconSrc })
    }
  })

  return (
    <div className="w-80 font-sans p-4 bg-slate-600 text-gray-200 flex  flex-col gap-4 min-h-[400px]">
      <h1 className="text-2xl font-black text-center ">BuiltIn Job Buddy</h1>

      <div className="bg-gray-200 h-px w-5/6 mx-auto" />

      <div className="color-area flex flex-col items-center gap-2 relative">
        <h3 className="font-bold text-lg text-center">Color Picker</h3>
        <div className="flex flex-row gap-9   w-36">
          <label htmlFor="color-preview font-bold ">Banned</label>
          <div
          style={{
            backgroundColor: bannedColor
          }}
            onClick={() => setShowBannedColorPicker(true)}
            className="color-preview h-5 w-12 border border-gray-200 rounded-full cursor-pointer"
            id="color-preview"
          />
          {showBannedColorPicker ? (
            <div
              style={{
                position: "absolute",
                left: "15px",
                top: "-10px",
                zIndex: "2"
              }}>
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px"
                }}
                onClick={() => setShowBannedColorPicker(false)}
              />
              <SketchPicker
                color={bannedColor}
                onChange={(color) => {
                  setBannedColor(color.hex)
                }}
              />
            </div> //end of div containing color picker
          ) : null}
        </div>
      
        <div className="flex flex-row gap-9   w-36 ">
          <label htmlFor="color-preview font-bold ">Applied</label>

          <div
          style={{
            backgroundColor: appliedColor
          }}
            onClick={() => setShowAppliedColorPicker(true)}
            className=
            {`color-preview h-5 w-12 border border-gray-200 rounded-full cursor-pointer"
            id="color-preview`}
          />
      
          {showAppliedColorPicker ? (
            <div
              style={{
                position: "absolute",
                left: "15px",
                top: "-10px",
                zIndex: "2"
              }}>
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  right: "0px",
                  bottom: "0px",
                  left: "0px"
                }}
                onClick={() => setShowAppliedColorPicker(false)}
              />
              <SketchPicker
                color={appliedColor}
                onChange={(color) => {
                  setAppliedColor(color.hex)
                }}
              />
            </div> //end of div containing color picker
          ) : null}
        </div>
      </div>

      <div className="bg-gray-200 h-px w-5/6 mx-auto " />
     
<div className="banned-terms-area flex flex-col items-center gap-4">
        <div className="flex justify-items-center gap-2 items-center ">
          <label>Hide Banned Jobs</label>
          <input
          className="rounded cursor-pointer"
            type="checkbox"
            checked={hideBannedJobs === "true" ? true : false}
            onChange={() => {
              if (hideBannedJobs === "false") {
                setHideBannedJobs("true")
              } else {
                setHideBannedJobs("false")
              }
            }}
          />


       
        </div>
        <form
              onSubmit={(e) => {
                const tempBannedTerm = bannedTerm
                e.preventDefault()

                if(tempBannedTerm.trim() !== ""){

           
                setBannedJobTitles([
                  ...bannedJobTitles,
                  tempBannedTerm.toLowerCase()
                ])
                setBannedTerm("")
              }
              }}>
              <input
              required
              className="w-44 h-7 rounded p-2 mr-4 text-slate-800"
                type="text"
                placeholder="Add a banned term"
                value={bannedTerm}
                onChange={(e) => {
                  setBannedTerm(e.target.value)
                }}
              />
              <button className="bg-green-600 hover:bg-green-700 font-bold rounded h-7 w-16 ">Add</button>
            </form>


        <div className="w-3/4 mb-8 ">
          <h3>Banned Terms List</h3>
              

        <div className="max-h-72 overflow-y-scroll">
            {bannedJobTitles.map((title, index) => {
              return (
             
                  
                  <div key={index} className="odd:bg-white even:bg-slate-200 text-slate-800 text-lg font-semibold flex justify-between items-center p-1  " >
                    <p>
                    {title}
                    </p>
               
                    <button
                    className=""
                      onClick={() => {
                        setBannedJobTitles(
                          bannedJobTitles.filter((t, i) => i !== index)
                        )
                      }}
                     >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-red-400 hover:stroke-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
</svg>
                    </button>
                  </div>
             
              )
            })}
                </div>
        
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
