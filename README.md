## Deployment Architecture 
```mermaid
C4Deployment
    title  
    
    Deployment_Node(github, "GitHub SPA host") {
        Container(React, "React", "", "")
    }

    Deployment_Node(azure, "Azure") {
        Deployment_Node(organizationalResources, "Organizational Resources") {
        ContainerDb(Organizational_Resources, "Organizational Resources", "")
        
        Deployment_Node(appRegistrations, "App Registrations") {
                Container(helloworld_app, "helloworld-app", "Graph API permissions", "User.ReadWrite, Presence.ReadWrite")
            }
        }

        Deployment_Node(publishingOrganization, "Publishing Organization") {
            Container(Service_Principal, "Service Principal", "", "")
            Container(Enterprise_Application, "Enterprise Application", "", "")        
        }
    }
        
    Deployment_Node(teams, "Teams") {
        Container(Teams, "Teams", "", "")
    }
    
    Rel(helloworld_app, Enterprise_Application, "Exposes as")
    Rel(Teams, Service_Principal, "Delegates to")
    Rel(React, Teams, "Provides endpoint")
    BiRel(Service_Principal, Organizational_Resources, "Accesses")
    BiRel(Teams, Organizational_Resources, "On behalf of user")

    UpdateElementStyle(azure, $borderColor="black")
    UpdateElementStyle(github, $borderColor="black")
    UpdateElementStyle(teams, $borderColor="black")
    UpdateElementStyle(organizationalResources, $borderColor="black")
    UpdateElementStyle(appRegistrations, $borderColor="black")
    UpdateElementStyle(publishingOrganization, $borderColor="black")
    
    UpdateRelStyle(helloworld_app, Enterprise_Application, $textColor="white", $lineColor="white", ,$offsetX="5")
    UpdateRelStyle(Teams, Service_Principal, $textColor="white", $lineColor="white")
    UpdateRelStyle(React, Teams, $textColor="white", $lineColor="white", $offsetY="-15", $offsetX="-40")
    UpdateRelStyle(Service_Principal, Organizational_Resources, $textColor="white", $lineColor="white", $offsetY="-15", $offsetX="-40")
    UpdateRelStyle(Teams, Organizational_Resources, $textColor="white", $lineColor="white", $offsetY="-15", $offsetX="-40")
      
```
